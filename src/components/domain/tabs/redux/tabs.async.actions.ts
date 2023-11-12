import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    RequestFailedError,
    RequestFormMode,
    RequestMethod,
    RequestModel,
    ResponseModel,
    SupportedAuthType,
    SupportedBodyType,
    SupportedSnippetLang,
    TabData,
    UpdateEditableItemEnabled,
    UpdateEditableItemName,
    UpdateEditableItemValue
} from "@/common/types";
import { v4 as uuiv4 } from "uuid";
import {
    newTab,
    deleteTab,
    populateRequestSection,
    clearRequestSection,
    setName,
    setMethod,
    setUrl,
    setLoading,
    clearResponseForTab,
    updateQueryItemValue,
    updateQueryItemEnabled,
    updateQueryItemName,
    addQueryItem,
    removeQueryItem,
    updateHeaderName,
    updateHeaderValue,
    updateHeaderEnabled,
    addHeader,
    removeHeader,
    setBodyType,
    setEnableTextBody,
    setTextBody,
    addFormDataItem,
    removeFormDataItem,
    updateFormDataItemName,
    updateFormDataItemValue,
    updateFormDataItemEnabled,
    populatedTabData,
    setAuthType,
    setBasicAuthUsername,
    setBasicAuthPassword,
    setTokenPrefix,
    setTokenValue,
} from "./tabs.reducer";
import { TabModel, UpdateTabDbModel, defaultNewCollectionRequestTabData, defaultTabData, tabRepo, toTabDbData, toTabDbModel, updateTabDataInDB } from "@/lib/db";
import { RootState } from "@/common/store";
import { toFetchConfig } from "@/lib/request.utils";
import { getContentTypeHeader } from "@/lib/header.utils";
import { toResponseModel } from "@/lib/response.utils";
import { v4 as uuidv4 } from "uuid";
import { addtoHistoryAsync } from "../../request.history/redux/history.async.actions";
import { getCodeSnippet } from "@/lib/snippets";
import { deepCpObj, getQueryItems, getQueryString, getUpdatedUrl } from "@/lib/utils";

// #region form-actions

export const makeRequestActionAsync = createAsyncThunk<{ result: ResponseModel, error: any, tabId: string }, string>('tabs/makeRequestActionAsync', async (tabId, thunkAPI) => {

    const { getState, dispatch, rejectWithValue } = thunkAPI;

    const rootState = getState() as RootState;

    const tabData = rootState.tabsStore.tabData[tabId];

    const { method, query, headers, formItems, bodyType, enableTextBody, textBody, authConfig, collectionId } = tabData

    const { url: fetchUrl, ...fetchConfig } = toFetchConfig(rootState, tabId);

    if (bodyType !== "formdata") {
        fetchConfig.headers["content-type"] = getContentTypeHeader(bodyType);
    }

    const start = new Date().getTime();
    const abortController = new AbortController();

    dispatch(setLoading(abortController));
    dispatch(clearResponseForTab(tabId));

    try {
        const response = await fetch(fetchUrl, {
            ...fetchConfig,
            signal: abortController.signal,
        });

        const ms = new Date().getTime() - start;

        const [result, error] = await toResponseModel(response, ms);

        return {
            result, tabId, error
        };

    } catch (error) {
        const e = error as Error;
        console.log(e);
        const failedError = new RequestFailedError(e.name, e.message, tabId, error);
        return rejectWithValue(failedError);

    } finally {
        const newReqHistoryItem: RequestModel = {
            id: uuidv4(),
            collectionId,
            method,
            name: fetchUrl,
            url: fetchUrl,
            query: query,
            headers: headers,
            triggered: new Date().getTime(),
            ...(method !== "get" ? {
                bodytype: bodyType,
                textBody: textBody,
                enableTextBody: enableTextBody,
                formItems
            } : {}),
            auth: authConfig
        }
        dispatch(addtoHistoryAsync(newReqHistoryItem));
    }
});

export const abortOngoingRequestAsync = createAsyncThunk<void, string>("tabs/abortOngoingRequestAsync", async (tabId, thunkAPI) => {
    const { getState } = thunkAPI;
    const rootState = getState() as RootState;
    const tabData = rootState.tabsStore.tabData[tabId];
    const aborter = tabData.aborter;
    aborter?.abort();
});

export const generateCodeSnippetAsync = createAsyncThunk<void, SupportedSnippetLang>("tabs/generateCodeSnippetAsync", async (lang, thunkAPI) => {

    const { getState } = thunkAPI;
    const rootState = getState() as RootState;
    const activeTab = rootState.tabsStore.activeTab;
    const data = rootState.tabsStore.tabData[activeTab];
    const codeSnippet = getCodeSnippet(data, lang);

    console.log(codeSnippet);
});

// #endregion form-actions

// #region tab-actions
export const newTabAsync = createAsyncThunk<void, void>("tabs/newTabAsync", async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;

    const tabData = defaultTabData();
    const tabModel: TabModel = {
        id: uuiv4(),
        name: "New Request",
        data: tabData
    };

    dispatch(newTab(tabModel));
    try {
        await tabRepo.insert(toTabDbModel(tabModel));
    } catch (error) {
        console.log(`couldn't add tab to db ${error}`);
    }
});

export const newCollectionRequestTabAsync = createAsyncThunk<void, { collectionId: string, collectionName: string }>(
    "tabs/newCollectionRequestTabAsync",
    async (arg, thunkAPI) => {
        const { collectionId, collectionName } = arg;

        const { dispatch } = thunkAPI;

        const tabData = defaultNewCollectionRequestTabData(collectionId, collectionName);
        const tabModel: TabModel = {
            id: uuiv4(),
            name: "unnamed",
            data: tabData
        };

        dispatch(newTab(tabModel));

        try {
            await tabRepo.insert(toTabDbModel(tabModel));
        } catch (error) {
            console.log(`couldn't add tab to db ${error}`);
        }
    }
)

export const deleteTabAsync = createAsyncThunk<void, string>("tabs/deleteTabAsync", async (tabId, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch((deleteTab(tabId)));
    try {
        await tabRepo.delete(tabId);
    } catch (error) {
        console.log(`couldn't delete tab from db ${error}`);
    }
});

export const populateRequestSectionAsync = createAsyncThunk<void, { model: RequestModel, mode: RequestFormMode, collectionName?: string }>("tabs/populateRequestSectionAsync", async (args, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const newTabId = uuiv4();
    const { mode, model, collectionName } = args;

    const tab: TabModel = {
        id: newTabId,
        name: model.name || model.url,
        data: populatedTabData(model, mode, collectionName)
    };

    try {
        await tabRepo.insert(toTabDbModel(tab));
    } catch (error) {
        console.log(`couldn't add tab to db ${error}`);
    } finally {
        dispatch(populateRequestSection({ tabId: newTabId, mode, model, collectionName }));
    }
});

export const clearRequestSectionAsync = createAsyncThunk<void, void>("tabs/clearRequestSectionAsync", async (_, thunkAPI) => {
    const { getState, dispatch } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(clearRequestSection());

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.id = "";
        tbData.collectionId = "default";
        tbData.mode = "insert";
        tbData.name = "";
        tbData.method = "get";
        tbData.url = '';
        tbData.query = [];
        tbData.headers = [];
        tbData.formItems = [];
        tbData.bodyType = "formdata";
        tbData.enableTextBody = true;
        tbData.textBody = "";
        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            name: "New request",
            data: toTabDbData(tbData)
        };
        await updateTabDataInDB(updateModel, "clearRequestSectionAsync");
    }
});

// #endregion tab-actions

// #region url-actions

export const setNameAsync = createAsyncThunk<void, string>("tabs/setNameAsync", async (newName, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    dispatch(setName(newName));
    const rootState = getState() as RootState;
    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.name = newName;
        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };
        await updateTabDataInDB(updateModel, "setNameAsync");
    }
});

export const setMethodAsync = createAsyncThunk<void, RequestMethod>("tabs/setMethodAsync", async (method, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;
    dispatch(setMethod(method));
    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.method = method;
        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };
        await updateTabDataInDB(updateModel, "setMethodAsync");
    }
});

export const setUrlAsync = createAsyncThunk<void, string>("tabs/setUrlAsync", async (url, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(setUrl(url));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.url = url
        if (url) {
            const queryString = url.split("?")[1];
            if (queryString) {
                tbData.query = getQueryItems(queryString);
            }
            else {
                tbData.query = [];
            }
        }
        else {
            tbData.query = [];
        }
        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "setUrlAsync");
    }
});

// #endregion url-actions

// #region query-actions

export const updateQueryItemValueAsync = createAsyncThunk<void, UpdateEditableItemValue>("tabs/updateQueryItemValueAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(updateQueryItemValue(arg));

    const { id, value } = arg;
    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        const itemIndex = tbData.query.findIndex(x => x.id === id);
        if (itemIndex > -1) {
            tbData.query[itemIndex].value = value;
            const queryStr = getQueryString(tbData.query);
            tbData.url = getUpdatedUrl(tbData.url, queryStr);
        }

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "updateQueryItemValueAsync");
    }
});

export const updateQueryItemEnabledAsync = createAsyncThunk<void, UpdateEditableItemEnabled>("tabs/updateQueryItemEnabledAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(updateQueryItemEnabled(arg));

    const { id } = arg;
    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        const itemIndex = tbData.query.findIndex(x => x.id === id);
        if (itemIndex > -1) {
            tbData.query[itemIndex].enabled = !tbData.query[itemIndex].enabled;
            const queryStr = getQueryString(tbData.query);
            tbData.url = getUpdatedUrl(tbData.url, queryStr);
        }

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "updateQueryItemEnabledAsync");
    }
})

export const updateQueryItemNameAsync = createAsyncThunk<void, UpdateEditableItemName>("tabs/updateQueryItemNameAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(updateQueryItemName(arg));

    const { id, name } = arg;
    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        const itemIndex = tbData.query.findIndex(x => x.id === id);
        if (itemIndex > -1) {
            tbData.query[itemIndex].name = name;
            const queryStr = getQueryString(tbData.query);
            tbData.url = getUpdatedUrl(tbData.url, queryStr);
        }

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "updateQueryItemNameAsync");
    }
});

export const addQueryItemAsync = createAsyncThunk<void, void>("tabs/addQueryItemAsync", async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    const newQItemId = uuidv4();

    dispatch(addQueryItem(newQItemId));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.query.push({
            id: newQItemId,
            name: "",
            value: "",
            enabled: true
        });

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "addQueryItemAsync");
    }
});

export const removeQueryItemAsync = createAsyncThunk<void, string>("tabs/removeQueryItemAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(removeQueryItem(arg));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        const itemIndex = tbData.query.findIndex(x => x.id === arg);
        if (itemIndex > -1) {
            tbData.query.splice(itemIndex, 1);
            const queryStr = getQueryString(tbData.query);
            tbData.url = getUpdatedUrl(tbData.url, queryStr);
        }

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "removeQueryItemAsync");
    }
});

// #endregion query-actions

// #region header-actions
export const updateHeaderNameAsync = createAsyncThunk<void, UpdateEditableItemName>("tabs/updateHeaderNameAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(updateHeaderName(arg));

    const { id, name } = arg;
    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        const itemIndex = tbData.headers.findIndex(x => x.id === id);
        if (itemIndex > -1) {
            tbData.headers[itemIndex].name = name;
        }

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "updateHeaderNameAsync");
    }
});

export const updateHeaderValueAsync = createAsyncThunk<void, UpdateEditableItemValue>("tabs/updateHeaderValueAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(updateHeaderValue(arg));

    const { id, value } = arg;
    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        const itemIndex = tbData.headers.findIndex(x => x.id === id);
        if (itemIndex > -1) {
            tbData.headers[itemIndex].value = value;
        }

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "updateHeaderValueAsync");
    }
});

export const updateHeaderEnabledAsync = createAsyncThunk<void, UpdateEditableItemEnabled>("tabs/updateHeaderEnabledAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(updateHeaderEnabled(arg));

    const { id } = arg;
    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        const itemIndex = tbData.headers.findIndex(x => x.id === id);
        if (itemIndex > -1) {
            tbData.headers[itemIndex].enabled = !tbData.headers[itemIndex].enabled;
        }

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "updateHeaderEnabledAsync");
    }
});

export const addHeaderAsync = createAsyncThunk<void, void>("tabs/addHeaderAsync", async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    const newHeaderId = uuidv4();

    dispatch(addHeader(newHeaderId));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.headers.push({
            id: newHeaderId,
            name: "",
            value: "",
            enabled: true
        });

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "addHeaderAsync");
    }



});

export const removeHeaderAsync = createAsyncThunk<void, string>("tabs/removeHeaderAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(removeHeader(arg));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        const itemIndex = tbData.headers.findIndex(x => x.id === arg);
        if (itemIndex > -1) {
            tbData.headers.splice(itemIndex, 1);
        }
        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "removeHeaderAsync");
    }
});

// #endregion header-actions

// #region request-body-actions
export const setBodyTypeAsync = createAsyncThunk<void, SupportedBodyType>("tabs/setBodyTypeAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(setBodyType(arg));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.textBody = "";
        tbData.formItems = [];
        tbData.bodyType = arg
        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "setBodyTypeAsync");
    }
});

export const setEnableTextBodyAsync = createAsyncThunk<void, boolean>("tabs/setEnableTextBodyAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(setEnableTextBody(arg));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.enableTextBody = arg;
        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };
        await updateTabDataInDB(updateModel, "setEnableTextBodyAsync");
    }

});

export const setTextBodyAsync = createAsyncThunk<void, string>("tabs/setTextBodyAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(setTextBody(arg));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.textBody = arg;

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "setTextBodyAsync");
    }
});

export const addFormDataItemAsync = createAsyncThunk<void, void>("tabs/addFormDataItemAsync", async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    const newFormItemId = uuidv4();

    dispatch(addFormDataItem(newFormItemId));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.formItems.push({
            id: newFormItemId,
            name: "",
            value: "",
            enabled: true
        });

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "addFormDataItemAsync");
    }
});

export const removeFormDataItemAsync = createAsyncThunk<void, string>("tabs/removeFormDataItemAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(removeFormDataItem(arg));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        const itemIndex = tbData.formItems.findIndex(x => x.id === arg);
        if (itemIndex > -1) {
            tbData.formItems.splice(itemIndex, 1);
        }

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "removeFormDataItemAsync");
    }

});

export const updateFormDataItemNameAsync = createAsyncThunk<void, UpdateEditableItemName>("tabs/updateFormDataItemNameAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(updateFormDataItemName(arg));

    const { name, id } = arg;
    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        const itemIndex = tbData.formItems.findIndex(x => x.id === id);
        if (itemIndex > -1) {
            tbData.formItems[itemIndex].name = name;
        }

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "updateFormDataItemNameAsync");
    }
});

export const updateFormDataItemValueAsync = createAsyncThunk<void, UpdateEditableItemValue>("tabs/updateFormDataItemValueAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(updateFormDataItemValue(arg));

    const { value, id } = arg;
    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        const itemIndex = tbData.formItems.findIndex(x => x.id === id);
        if (itemIndex > -1) {
            tbData.formItems[itemIndex].value = value;
        }

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "updateFormDataItemValueAsync");
    }
});

export const updateFormDataItemEnabledAsync = createAsyncThunk<void, UpdateEditableItemEnabled>("tabs/updateFormDataItemEnabledAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(updateFormDataItemEnabled(arg));

    const { id } = arg;
    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        const itemIndex = tbData.formItems.findIndex(x => x.id === id);
        if (itemIndex > -1) {
            tbData.formItems[itemIndex].enabled = !tbData.formItems[itemIndex].enabled;
        }

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "updateFormDataItemEnabledAsync");
    }
});

// #endregion request-body-actions

// #region request-auth-actions
export const setAuthTypeAsync = createAsyncThunk<void, SupportedAuthType>("tabs/setAuthTypeAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(setAuthType(arg));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.authConfig.authType = arg

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "setAuthTypeAsync");
    }
});

export const setBasicAuthUsernameAsync = createAsyncThunk<void, string>("tabs/setBasicAuthUsernameAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(setBasicAuthUsername(arg));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.authConfig.basicUsername = arg

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "setBasicAuthUsernameAsync");
    }
});

export const setBasicAuthPasswordAsync = createAsyncThunk<void, string>("tabs/setBasicAuthPasswordAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(setBasicAuthPassword(arg));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.authConfig.basicPassword = arg

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "setBasicAuthPasswordAsync");
    }
});


export const setTokenPrefixAsync = createAsyncThunk<void, string>("tabs/setTokenPrefixAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(setTokenPrefix(arg));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.authConfig.tokenPrefix = arg;

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "setTokenPrefixAsync");
    }
});

export const setTokenValueAsync = createAsyncThunk<void, string>("tabs/setTokenValueAsync", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(setTokenValue(arg));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];
    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.authConfig.tokenVal = arg;

        const updateModel: UpdateTabDbModel = {
            id: activeTab,
            data: toTabDbData(tbData)
        };

        await updateTabDataInDB(updateModel, "setTokenValueAsync");
    }
});
// #endregion request-auth-actions