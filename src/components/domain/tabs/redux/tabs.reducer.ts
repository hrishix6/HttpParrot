import { FormDataItem, HeaderItem, QueryItem, RequestFormMode, RequestMethod, RequestModel, RequestTab, ResponseHeader, SupportedBodyType, TabData, TabDataHolder, TabDataKey, UpdateFormDataItemEnabled, UpdateFormDataItemName, UpdateFormDataItemValue, UpdateHeaderEnabled, UpdateHeaderName, UpdateHeaderValue, UpdateQueryItemEnabled, UpdateQueryItemName, UpdateQueryItemValue } from "@/common/types";
import { RootState } from "@/common/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TabModel } from "@/lib/db";
import { getQueryString, getUpdatedUrl } from "@/lib/utils";
import { RequestFailedError, abortOngoingRequestAsync, generateCodeSnippetAsync, makeRequestActionAsync } from "./tabs.async.actions";

function tabDataSelector<T>(state: RootState, key: TabDataKey): T {
    const currentActive = state.tabsStore.activeTab;
    const data = state.tabsStore.tabData[currentActive];
    return data[key] as T;
}

export const populatedTabData = (model: RequestModel, mode: RequestFormMode, collectionName?: string): TabData => ({
    id: model.id,
    collectionId: model.collectionId || "",
    userEditingUrl: true,
    collectionName: collectionName || "",
    name: model.name,
    mode,
    method: model.method,
    query: model.query,
    headers: model.headers,
    url: model.url,
    bodyType: model.bodytype || "formdata",
    enableTextBody: model.enableTextBody!,
    textBody: model.textBody || "",
    formItems: model.formItems || [],
    loading: false,
    lock: false,
    responseStatus: "",
    responseSize: "",
    responseTime: "",
    responseBody: "",
    responseBodyType: "unknown",
    responseHeaders: [],
    responseOk: false,
    responseMimetype: ""
});


export interface TabsState {
    activeTab: string;
    tabs: RequestTab[];
    tabData: TabDataHolder;
}

const initialState: TabsState = {
    activeTab: "",
    tabs: [],
    tabData: {},
}
/**
 * When mode = "insert" new uuid will be generated and item will be saved (if user is trying to save request).
 * When mode = 'update' the request item in saved requests will be updated with new values from form.
 * When user clicks 'View' on history item -> form will be populated with mode - 'insert' and other fields.
 * when user clicks 'View' on saved request -> form will be populated with mode - 'update', 'id' and other fields
*/
const tabSlice = createSlice({
    name: "tabs",
    initialState,
    reducers: {
        //tab====================================================================================
        populateTabsData: (state, action: PayloadAction<TabsState>) => {
            const { activeTab, tabData, tabs } = action.payload;
            state.tabData = tabData;
            state.tabs = tabs;
            state.activeTab = activeTab;
        },
        newTab: (state, action: PayloadAction<TabModel>) => {
            const { id, name, data } = action.payload;
            state.activeTab = id;
            state.tabs.push({ id, name });
            state.tabData[id] = data;
        },
        deleteTab: (state, action: PayloadAction<string>) => {
            const tab2deleteIndex = state.tabs.findIndex(x => x.id === action.payload);
            if (tab2deleteIndex > -1) {
                let tabId2SetActive = "";
                const prevIdx = tab2deleteIndex - 1;
                const nextIdx = tab2deleteIndex + 1;
                if (state.tabs[prevIdx]) {
                    tabId2SetActive = state.tabs[prevIdx].id;
                }
                else if (state.tabs[nextIdx]) {
                    tabId2SetActive = state.tabs[nextIdx].id;
                }
                state.activeTab = tabId2SetActive;
                state.tabs.splice(tab2deleteIndex, 1);
                delete state.tabData[action.payload];
            }
        },
        setActiveTab: (state, action: PayloadAction<string>) => {
            const tab2deleteIndex = state.tabs.findIndex(x => x.id === action.payload);
            if (tab2deleteIndex > -1) {
                state.activeTab = action.payload;
            }
        },
        //response ====================================================================================
        clearResponseForTab: (state, action: PayloadAction<string>) => {
            const tabId = action.payload;
            const clearResponseOfTab = state.tabData[tabId];
            if (clearResponseOfTab) {
                clearResponseOfTab.responseStatus = "";
                clearResponseOfTab.responseSize = "";
                clearResponseOfTab.responseTime = "";
                clearResponseOfTab.responseBody = "";
                clearResponseOfTab.responseBodyType = "unknown";
                clearResponseOfTab.responseHeaders = [];
                clearResponseOfTab.responseOk = false;
                clearResponseOfTab.responseMimetype = "";
            }
        },
        clearResponse: (state, _) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.responseStatus = "";
                currentTabData.responseSize = "";
                currentTabData.responseTime = "";
                currentTabData.responseBody = "";
                currentTabData.responseBodyType = "unknown";
                currentTabData.responseHeaders = [];
                currentTabData.responseOk = false;
                currentTabData.responseMimetype = "";
            }
        },
        discardBody: (state, _) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.responseBody = ""
                currentTabData.responseBodyType = "unknown";
                currentTabData.responseMimetype = ""
            }
        },
        populateRequestSection: (state, action: PayloadAction<{ tabId: string, model: RequestModel, mode: RequestFormMode, collectionName?: string }>) => {
            const { mode, model, collectionName, tabId } = action.payload;
            const { name, url } = model;
            const newTab: RequestTab = {
                id: tabId,
                name: name || url
            }
            state.tabs.push(newTab);
            state.tabData[newTab.id] = populatedTabData(model, mode, collectionName);
            state.activeTab = newTab.id;
        },
        clearRequestSection: (state) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.id = "";
                currentTabData.collectionId = "default";
                currentTabData.mode = "insert";
                currentTabData.name = "";
                currentTabData.userEditingUrl = true;
                currentTabData.method = "get";
                currentTabData.url = '';
                currentTabData.query = [];
                currentTabData.headers = [];
                currentTabData.formItems = [];
                currentTabData.bodyType = "formdata";
                currentTabData.enableTextBody = true;
                currentTabData.textBody = "";
            }

        },
        setName: (state, action: PayloadAction<string>) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.name = action.payload;
            }
        },
        setMethod: (state, action: PayloadAction<RequestMethod>) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.method = action.payload;
            }
        },
        setUrl: (state, action: PayloadAction<string>) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.userEditingUrl = true;
                currentTabData.url = action.payload;
            }
        },
        userWantsToEditUrl: (state) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.userEditingUrl = true;
            }
        },
        userDoneEditingUrl: (state) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.userEditingUrl = false;
            }
        },
        setLoading: (state, action: PayloadAction<AbortController>) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.loading = true;
                currentTabData.aborter = action.payload;
                currentTabData.lock = true;
            }
        },
        stopLoading: (state) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.loading = false;
                currentTabData.aborter = undefined;
                currentTabData.lock = false;
            }
        },
        //query==================================================================
        initQueryItems: (state, action: PayloadAction<QueryItem[]>) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.query = action.payload;
            }
        },
        updateQueryItemName: (state, action: PayloadAction<UpdateQueryItemName>) => {
            const { id, name } = action.payload;
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                const itemIndex = currentTabData.query.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    currentTabData.query[itemIndex].name = name;
                    const queryStr = getQueryString(currentTabData.query);
                    currentTabData.url = getUpdatedUrl(currentTabData.url, queryStr);
                }
            }

        },
        updateQueryItemValue: (state, action: PayloadAction<UpdateQueryItemValue>) => {
            const { id, value } = action.payload;
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                const itemIndex = currentTabData.query.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    currentTabData.query[itemIndex].value = value;
                    const queryStr = getQueryString(currentTabData.query);
                    currentTabData.url = getUpdatedUrl(currentTabData.url, queryStr);
                }
            }
        },
        updateQueryItemEnabled: (state, action: PayloadAction<UpdateQueryItemEnabled>) => {
            const { id } = action.payload;
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                const itemIndex = currentTabData.query.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    currentTabData.query[itemIndex].enabled = !currentTabData.query[itemIndex].enabled;
                    const queryStr = getQueryString(currentTabData.query);
                    currentTabData.url = getUpdatedUrl(currentTabData.url, queryStr);
                }
            }

        },
        addQueryItem: (state, action: PayloadAction<string>) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.query.push({
                    id: action.payload,
                    name: "",
                    value: "",
                    enabled: true
                });
            }
        },
        removeQueryItem: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                const itemIndex = currentTabData.query.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    currentTabData.query.splice(itemIndex, 1);
                    const queryStr = getQueryString(currentTabData.query);
                    currentTabData.url = getUpdatedUrl(currentTabData.url, queryStr);
                }
            }

        },
        //headers===========================================================
        updateHeaderName: (state, action: PayloadAction<UpdateHeaderName>) => {
            const { id, name } = action.payload;
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                const itemIndex = currentTabData.headers.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    currentTabData.headers[itemIndex].name = name;
                }
            }
        },
        updateHeaderValue: (state, action: PayloadAction<UpdateHeaderValue>) => {
            const { id, value } = action.payload;
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                const itemIndex = currentTabData.headers.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    currentTabData.headers[itemIndex].value = value;
                }
            }
        },
        updateHeaderEnabled: (state, action: PayloadAction<UpdateHeaderEnabled>) => {
            const { id } = action.payload;
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                const itemIndex = currentTabData.headers.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    currentTabData.headers[itemIndex].enabled = !currentTabData.headers[itemIndex].enabled;
                }
            }
        },
        addHeader: (state, action: PayloadAction<string>) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.headers.push({
                    id: action.payload,
                    name: "",
                    value: "",
                    enabled: false
                });
            }
        },
        removeHeader: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                const itemIndex = currentTabData.headers.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    currentTabData.headers.splice(itemIndex, 1);
                }
            }
        },
        //body ==================================================================
        setBodyType: (state, action: PayloadAction<SupportedBodyType>) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.textBody = "";
                currentTabData.formItems = [];
                currentTabData.bodyType = action.payload;
            }
        },
        setEnableTextBody: (state, action: PayloadAction<boolean>) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.enableTextBody = action.payload;
            }
        },
        setTextBody: (state, action: PayloadAction<string>) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.textBody = action.payload;
            }
        },
        addFormDataItem: (state, action: PayloadAction<string>) => {
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                currentTabData.formItems.push({
                    id: action.payload,
                    name: "",
                    value: "",
                    enabled: true
                });
            }
        },
        removeFormDataItem: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                const itemIndex = currentTabData.formItems.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    currentTabData.formItems.splice(itemIndex, 1);
                }
            }
        },
        updateFormDataItemName: (state, action: PayloadAction<UpdateFormDataItemName>) => {
            const { id, name } = action.payload;
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                const itemIndex = currentTabData.formItems.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    currentTabData.formItems[itemIndex].name = name;
                }
            }
        },
        updateFormDataItemValue: (state, action: PayloadAction<UpdateFormDataItemValue>) => {
            const { id, value } = action.payload;
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                const itemIndex = currentTabData.formItems.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    currentTabData.formItems[itemIndex].value = value;
                }
            }
        },
        updateFormDataItemEnabled: (state, action: PayloadAction<UpdateFormDataItemEnabled>) => {
            const { id } = action.payload;
            const activeTab = state.activeTab;
            const currentTabData = state.tabData[activeTab];
            if (currentTabData) {
                const itemIndex = currentTabData.formItems.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    currentTabData.formItems[itemIndex].enabled = !currentTabData.formItems[itemIndex].enabled;

                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(makeRequestActionAsync.pending, (_, __) => {
                console.log(`req start - clared response data.`);
            })
            .addCase(makeRequestActionAsync.fulfilled, (state, action) => {
                const { result, tabId } = action.payload;
                const currentTabData = state.tabData[tabId];
                const { size, status, time, contentType, statusText, body, headers, ok, mimeType } = result;
                if (currentTabData) {
                    currentTabData.responseStatus = status ? `${status} ${statusText}` : "";
                    currentTabData.responseSize = size ? `${size} bytes` : "";
                    currentTabData.responseTime = time ? `${time} ms` : "";
                    currentTabData.responseBodyType = contentType;
                    currentTabData.responseBody = body;
                    currentTabData.responseHeaders = headers;
                    currentTabData.responseOk = ok;
                    currentTabData.responseMimetype = mimeType;
                    currentTabData.loading = false;
                    currentTabData.aborter = undefined;
                    currentTabData.lock = false;
                }
            })
            .addCase(makeRequestActionAsync.rejected, (state, action) => {
                console.log(`rejected makeRequestActionAsync, error data: `, action.payload);
                const failedError = action.payload as RequestFailedError
                const failedTab = failedError.tabId;
                const failedTabData = state.tabData[failedTab];
                if (failedTabData) {
                    failedTabData.loading = false;
                    failedTabData.aborter = undefined;
                    failedTabData.lock = false;
                }
            })
            .addCase(generateCodeSnippetAsync.fulfilled, (_, __) => {
                console.log(`snippet generated`);
            }).addCase(generateCodeSnippetAsync.pending, (_, __) => {
                console.log(`snippet gen started`);
            }).addCase(generateCodeSnippetAsync.rejected, (_, __) => {
                console.log(`snippet gen failed`);
            }).addCase(abortOngoingRequestAsync.pending, (_, __) => {
                console.log('initited aborting request');
            }).addCase(abortOngoingRequestAsync.fulfilled, (_, __) => {
                console.log('successfully aborting request');
            }).addCase(abortOngoingRequestAsync.rejected, (_, __) => {
                console.log('failed aborting request');
            })
    }
});

export const {
    populateTabsData,
    clearResponseForTab,
    newTab,
    deleteTab,
    setActiveTab,
    clearResponse,
    discardBody,
    setLoading,
    stopLoading,
    setTextBody,
    setEnableTextBody,
    updateFormDataItemName,
    updateFormDataItemValue,
    updateFormDataItemEnabled,
    addFormDataItem,
    removeFormDataItem,
    setBodyType,
    clearRequestSection,
    setName,
    userWantsToEditUrl,
    userDoneEditingUrl,
    initQueryItems,
    updateHeaderName,
    updateHeaderValue,
    updateHeaderEnabled,
    addHeader,
    removeHeader,
    populateRequestSection,
    setMethod,
    setUrl,
    updateQueryItemEnabled,
    updateQueryItemName,
    updateQueryItemValue,
    addQueryItem,
    removeQueryItem } = tabSlice.actions


export const tabsReducer = tabSlice.reducer;

export const selectRequestLoading = (state: RootState) => tabDataSelector<boolean>(state, "loading");

export const selectUrl = (state: RootState) => tabDataSelector<string>(state, "url");

export const selectMethod = (state: RootState) => tabDataSelector<RequestMethod>(state, "method");

export const selectQuery = (state: RootState) => tabDataSelector<QueryItem[]>(state, "query");

export const selectHeaders = (state: RootState) => tabDataSelector<HeaderItem[]>(state, "headers");

export const selectUserEditingUrl = (state: RootState) => tabDataSelector<boolean>(state, "userEditingUrl");

export const selectName = (state: RootState) => tabDataSelector<string>(state, "name");

export const selectRequestCollection = (state: RootState) => tabDataSelector<string>(state, "collectionId");

export const selectRequestCollectionName = (state: RootState) => tabDataSelector<string>(state, "collectionName");

export const selectFormMode = (state: RootState) => tabDataSelector<RequestFormMode>(state, "mode");

export const selectBodyType = (state: RootState) => tabDataSelector<SupportedBodyType>(state, "bodyType");

export const selectFormDataItems = (state: RootState) => tabDataSelector<FormDataItem[]>(state, "formItems");

export const selectTextBodyEnabled = (state: RootState) => tabDataSelector<boolean>(state, "enableTextBody");

export const selectTextBody = (state: RootState) => tabDataSelector<string>(state, "textBody");

export const selectIsLocked = (state: RootState) => tabDataSelector<boolean>(state, "lock");

//response============================================================================================
export const selectResponseStatus = (state: RootState) => tabDataSelector<string>(state, "responseStatus");
export const selectResponseSize = (state: RootState) => tabDataSelector<string>(state, "responseSize");
export const selectResponseTime = (state: RootState) => tabDataSelector<string>(state, "responseTime");
export const selectIfResponseOk = (state: RootState) => tabDataSelector<boolean>(state, "responseOk");
export const selectResponseBody = (state: RootState) => tabDataSelector<any>(state, "responseBody");
export const selectResponseBodytype = (state: RootState) => tabDataSelector<string>(state, "responseBodyType");
export const selectResponseHeaders = (state: RootState) => tabDataSelector<ResponseHeader[]>(state, "responseHeaders");
export const selectMimeType = (state: RootState) => tabDataSelector<string>(state, "responseMimetype");

//tabs============================================================================================
export const selectActiveTab = (state: RootState) => state.tabsStore.activeTab;
export const selectTabs = (state: RootState) => state.tabsStore.tabs;
//=================================================================================================
