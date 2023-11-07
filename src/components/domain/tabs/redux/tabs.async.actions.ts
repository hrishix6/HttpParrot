import { createAsyncThunk } from "@reduxjs/toolkit";
import { QueryItem, RequestFormMode, RequestMethod, RequestModel, ResponseModel, SupportedBodyType, SupportedSnippetLang, TabData, UpdateFormDataItemEnabled, UpdateFormDataItemName, UpdateFormDataItemValue, UpdateHeaderEnabled, UpdateHeaderName, UpdateHeaderValue, UpdateQueryItemEnabled, UpdateQueryItemName, UpdateQueryItemValue } from "@/common/types";
import { v4 as uuiv4 } from "uuid";
import {
    newTab,
    deleteTab,
    populateRequestSection,
    clearRequestSection,
    setName,
    setMethod,
    setUrl,
    initQueryItems,
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
} from "./tabs.reducer";
import { TabModel, UpdateTabModel, tabRepo } from "@/lib/db";
import { RootState } from "@/common/store";
import { toFetchConfig } from "@/lib/request.utils";
import { getContentTypeHeader } from "@/lib/header.utils";
import { toResponseModel } from "@/lib/response.utils";
import { v4 as uuidv4 } from "uuid";
import { addtoHistoryAsync } from "../../request.history/redux/history.async.actions";
import { getCodeSnippet } from "@/lib/snippets";
import { getQueryString, getUpdatedUrl } from "@/lib/utils";

export class RequestFailedError extends Error {
    public tabId: string;
    public innerError: Error;
    constructor(msg: string, tabId: string, cause: any) {
        super(msg);
        this.tabId = tabId;
        this.innerError = cause;
    }
};

const defaultTabData = (): TabData => ({
    id: "",
    collectionId: "",
    collectionName: "",
    name: "",
    userEditingUrl: true,
    method: "get",
    url: '',
    query: [],
    headers: [],
    mode: "insert",
    bodyType: "formdata",
    formItems: [],
    enableTextBody: true,
    textBody: "",
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

async function updateTabDataInDB(model: UpdateTabModel, __: string) {
    try {
        const et = await tabRepo.checkIfExists(model.id);
        if (et) {
            await tabRepo.update(model);
        }
    } catch (error) {
        console.log(`couldn't update tab to db ${error}`);
    }
}

function deepCpObj<T>(obj: any): T {
    if (structuredClone && typeof structuredClone === "function") {
        return structuredClone(obj) as T;
    }
    return JSON.parse(JSON.stringify(obj)) as T;
}

export const makeRequestActionAsync = createAsyncThunk<{ result: ResponseModel, tabId: string }, string>('tabs/makeRequestActionAsync', async (tabId, thunkAPI) => {

    const { getState, dispatch, rejectWithValue } = thunkAPI;

    const rootState = getState() as RootState;

    const tabData = rootState.tabsStore.tabData[tabId];

    console.log(`making req with following data: ${JSON.stringify(tabData, null, 2)}`);

    const { method, query, headers, formItems, bodyType, enableTextBody, textBody } = tabData

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

        const responseModel = await toResponseModel(response);

        return { result: { ...responseModel, time: ms }, tabId };

    } catch (error) {
        let msg = "something went wrong";
        if (error instanceof Error) {
            msg = error.message;
        }
        console.log(error);
        const failedError = new RequestFailedError(msg, tabId, error);
        return rejectWithValue(failedError);

    } finally {
        const newReqHistoryItem: RequestModel = {
            id: uuidv4(),
            collectionId: "",
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
            } : {})
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

// #region tab-actions
export const newTabAsync = createAsyncThunk<void, void>("tabs/newTabAsync", async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const tab: TabModel = {
        id: uuiv4(),
        name: "New Request",
        data: defaultTabData()
    };
    dispatch(newTab(tab));

    try {
        const result = await tabRepo.insert(tab);
        if (result) {
            console.log(`tab added to indexed db`);
        }
    } catch (error) {
        console.log(`couldn't add tab to db ${error}`);
    }
});

export const deleteTabAsync = createAsyncThunk<void, string>("tabs/deleteTabAsync", async (tabId, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch((deleteTab(tabId)));
    try {
        await tabRepo.delete(tabId);
        console.log(`tab deleted fro indexed db`);
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
        const result = await tabRepo.insert(tab);
        if (result) {
            console.log(`tab added to indexed db`);
        }
    } catch (error) {
        console.log(`couldn't add tab to db ${error}`);
    } finally {
        dispatch(populateRequestSection({ tabId: newTabId, mode, model, collectionName }));
    }
});

export const clearRequestSectionAsync = createAsyncThunk<void, void>("tabs/clearRequestSectionAsync", async (_, thunkAPI) => {
    const { getState, dispatch } = thunkAPI;
    dispatch(clearRequestSection());

    const rootState = getState() as RootState;
    const activeTab = rootState.tabsStore.activeTab;

    const updateModel: UpdateTabModel = {
        id: activeTab,
        data: {
            id: "",
            collectionId: "default",
            mode: "insert",
            name: "",
            userEditingUrl: true,
            method: "get",
            url: '',
            query: [],
            headers: [],
            formItems: [],
            bodyType: "formdata",
            enableTextBody: true,
            textBody: "",
        }
    };

    try {
        const result = await tabRepo.update(updateModel);
        if (result) {
            console.log(`tab updated to indexed db`);
        }
    } catch (error) {
        console.log(`couldn't update tab to db ${error}`);
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
        currentTabData.name = newName;
    }

    const updateModel: UpdateTabModel = {
        id: activeTab,
        data: currentTabData
    };

    await updateTabDataInDB(updateModel, "setNameAsync");

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
        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
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

        tbData.userEditingUrl = true;
        tbData.url = url

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
        };

        await updateTabDataInDB(updateModel, "setUrlAsync");
    }
});

// #endregion url-actions

// #region query-actions
export const initQueryItemsAsync = createAsyncThunk<void, QueryItem[]>("tabs/setUrlAsync", async (args, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootState = getState() as RootState;

    dispatch(initQueryItems(args));

    const activeTab = rootState.tabsStore.activeTab;
    const currentTabData = rootState.tabsStore.tabData[activeTab];

    if (currentTabData) {
        const tbData = deepCpObj<TabData>(currentTabData);
        tbData.query = args;
        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
        };
        await updateTabDataInDB(updateModel, "initQueryItemsAsync");
    }
});

export const updateQueryItemValueAsync = createAsyncThunk<void, UpdateQueryItemValue>("tabs/updateQueryItemValueAsync", async (arg, thunkAPI) => {
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
        };

        await updateTabDataInDB(updateModel, "updateQueryItemValueAsync");
    }
});

export const updateQueryItemEnabledAsync = createAsyncThunk<void, UpdateQueryItemEnabled>("tabs/updateQueryItemEnabledAsync", async (arg, thunkAPI) => {
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
        };

        await updateTabDataInDB(updateModel, "updateQueryItemEnabledAsync");
    }
})

export const updateQueryItemNameAsync = createAsyncThunk<void, UpdateQueryItemName>("tabs/updateQueryItemNameAsync", async (arg, thunkAPI) => {
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
        };

        await updateTabDataInDB(updateModel, "removeQueryItemAsync");
    }
});

// #endregion query-actions

// #region header-actions
export const updateHeaderNameAsync = createAsyncThunk<void, UpdateHeaderName>("tabs/updateHeaderNameAsync", async (arg, thunkAPI) => {
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
        };

        await updateTabDataInDB(updateModel, "updateHeaderNameAsync");
    }
});

export const updateHeaderValueAsync = createAsyncThunk<void, UpdateHeaderValue>("tabs/updateHeaderValueAsync", async (arg, thunkAPI) => {
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
        };

        await updateTabDataInDB(updateModel, "updateHeaderValueAsync");
    }
});

export const updateHeaderEnabledAsync = createAsyncThunk<void, UpdateHeaderEnabled>("tabs/updateHeaderEnabledAsync", async (arg, thunkAPI) => {
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
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
            enabled: false
        });

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
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
        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
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
        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
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
        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
        };

        await updateTabDataInDB(updateModel, "removeFormDataItemAsync");
    }

});

export const updateFormDataItemNameAsync = createAsyncThunk<void, UpdateFormDataItemName>("tabs/updateFormDataItemNameAsync", async (arg, thunkAPI) => {
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
        };

        await updateTabDataInDB(updateModel, "updateFormDataItemNameAsync");
    }
});

export const updateFormDataItemValueAsync = createAsyncThunk<void, UpdateFormDataItemValue>("tabs/updateFormDataItemValueAsync", async (arg, thunkAPI) => {
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
        };

        await updateTabDataInDB(updateModel, "updateFormDataItemValueAsync");
    }
});

export const updateFormDataItemEnabledAsync = createAsyncThunk<void, UpdateFormDataItemEnabled>("tabs/updateFormDataItemEnabledAsync", async (arg, thunkAPI) => {
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

        const updateModel: UpdateTabModel = {
            id: activeTab,
            data: tbData
        };

        await updateTabDataInDB(updateModel, "updateFormDataItemEnabledAsync");
    }
});

// #endregion request-body-actions