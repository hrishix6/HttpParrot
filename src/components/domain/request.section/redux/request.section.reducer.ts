import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "@/common/store";
import { makeRequestActionAsync } from "./request.async.actions";
import { UpdateHeaderName, UpdateHeaderValue, UpdateHeaderEnabled, QueryItem, HeaderItem, RequestMethod, UpdateQueryItemName, UpdateQueryItemValue, UpdateQueryItemEnabled, RequestModel, Token } from "@/common/types";
import { getTokens, splitTokens } from "@/lib/utils";

export type RequestFormMode = "update" | "insert";

export interface RequestSectionState {
    id: string;
    name: string;
    method: RequestMethod,
    url: string,
    query: QueryItem[],
    headers: HeaderItem[],
    userEditingUrl: boolean,
    urltokns: Token[],
    mode: RequestFormMode
}


const initialState: RequestSectionState = {
    id: "",
    name: "",
    userEditingUrl: true,
    method: "get",
    url: '',
    query: [],
    headers: [{
        id: uuidv4(),
        name: 'Accept',
        value: "*/*",
        enabled: true,
    }, {
        id: uuidv4(),
        name: 'User-Agent',
        value: "hrishix6/HttpClient",
        enabled: true,
    }],
    urltokns: [],
    mode: "insert"
};

export const getQueryString = (query: QueryItem[]) => {

    const enabledItems = query.filter(x => x.enabled);

    if (enabledItems.length) {
        const paramObj: Record<string, string> = {};
        for (let param of enabledItems) {
            if (param.name) {
                paramObj[param.name] = param.value;
            }
        }

        const q = `${new URLSearchParams(paramObj).toString()}`

        return q;
    }

    return "";
}

export const getQueryItems = (queryString: string): QueryItem[] => {

    const queryItems: QueryItem[] = [];
    if (queryString) {
        const params = new URLSearchParams(queryString);
        for (let p of params) {
            const [key, value] = p;
            queryItems.push({
                id: uuidv4(),
                name: key,
                value,
                enabled: true
            })
        }
    }

    return queryItems;
};

const getUpdatedUrl = (url: string, queryStr: string) => {
    const baeUrl = url?.split("?")[0] || "";
    if (queryStr) {
        return `${baeUrl}?${queryStr}`;
    }
    return baeUrl;
}


/**
 * When mode = "insert" new uuid will be generated and item will be saved (if user is trying to save request).
 * When mode = 'update' the request item in saved requests will be updated with new values from form.
 * When user clicks 'View' on history item -> form will be populated with mode - 'insert' and other fields.
 * when user clicks 'View' on saved request -> form will be populated with mode - 'update', 'id' and other fields
*/

const requestSectionSlice = createSlice({
    name: "request-section",
    initialState,
    reducers: {
        populateRequestSection: (state, action: PayloadAction<{ model: RequestModel, mode: RequestFormMode }>) => {
            const { mode, model } = action.payload;
            const { id, name, method, url, query, headers } = model;
            state.id = id;
            state.name = name;
            state.mode = mode;
            state.method = method;
            state.query = query;
            state.headers = headers;
            state.url = url;
            state.urltokns = getTokens(splitTokens(url));
        },
        resetFormModeAfterDeletion: (state) => {
            state.mode = "insert";
            state.id = "";
            state.name = ""
        },
        clearRequestSection: (state) => {
            state.mode = "insert";
            state.name = "";
            state.userEditingUrl = true;
            state.method = "get",
                state.url = '';
            state.query = [];
            state.headers = [{
                id: uuidv4(),
                name: 'Accept',
                value: "*/*",
                enabled: true,
            }, {
                id: uuidv4(),
                name: 'User-Agent',
                value: "hrishix6/HttpClient",
                enabled: true,
            }];
            state.urltokns = [];
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setMethod: (state, action: PayloadAction<RequestMethod>) => {
            state.method = action.payload;
        },
        setUrl: (state, action: PayloadAction<string>) => {
            state.userEditingUrl = true;
            state.url = action.payload;
        },
        userWantsToEditUrl: (state) => {
            state.userEditingUrl = true;
        },
        userDoneEditingUrl: (state) => {
            state.userEditingUrl = false;
            state.urltokns = getTokens(splitTokens(state.url));
        },
        //query
        initQueryItems: (state, action: PayloadAction<QueryItem[]>) => {
            state.query = action.payload;
        },
        updateQueryItemName: (state, action: PayloadAction<UpdateQueryItemName>) => {
            const { id, name } = action.payload;
            const itemIndex = state.query.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.query[itemIndex].name = name;
                const queryStr = getQueryString(state.query);
                state.url = getUpdatedUrl(state.url, queryStr);
                state.urltokns = getTokens(splitTokens(state.url));
            }
        },
        updateQueryItemValue: (state, action: PayloadAction<UpdateQueryItemValue>) => {
            const { id, value } = action.payload;
            const itemIndex = state.query.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.query[itemIndex].value = value;
                const queryStr = getQueryString(state.query);
                state.url = getUpdatedUrl(state.url, queryStr);
                state.urltokns = getTokens(splitTokens(state.url));
            }
        },
        updateQueryItemEnabled: (state, action: PayloadAction<UpdateQueryItemEnabled>) => {
            const { id } = action.payload;
            const itemIndex = state.query.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.query[itemIndex].enabled = !state.query[itemIndex].enabled;
                const queryStr = getQueryString(state.query);
                state.url = getUpdatedUrl(state.url, queryStr);
                state.urltokns = getTokens(splitTokens(state.url));
            }
        },
        addQueryItem: (state, _) => {
            state.query.push({
                id: uuidv4(),
                name: "",
                value: "",
                enabled: false
            });

        },
        removeQueryItem: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const itemIndex = state.query.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.query.splice(itemIndex, 1);
                const queryStr = getQueryString(state.query);
                state.url = getUpdatedUrl(state.url, queryStr);
                state.urltokns = getTokens(splitTokens(state.url));
            }
        },

        //headers
        updateHeaderName: (state, action: PayloadAction<UpdateHeaderName>) => {
            const { id, name } = action.payload;
            const itemIndex = state.headers.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.headers[itemIndex].name = name;
            }
        },
        updateHeaderValue: (state, action: PayloadAction<UpdateHeaderValue>) => {
            const { id, value } = action.payload;
            const itemIndex = state.headers.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.headers[itemIndex].value = value;
            }
        },
        updateHeaderEnabled: (state, action: PayloadAction<UpdateHeaderEnabled>) => {
            const { id } = action.payload;
            const itemIndex = state.headers.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.headers[itemIndex].enabled = !state.headers[itemIndex].enabled;

            }
        },
        addHeader: (state, _) => {
            state.headers.push({
                id: uuidv4(),
                name: "",
                value: "",
                enabled: false
            });

        },
        removeHeader: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const itemIndex = state.headers.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.headers.splice(itemIndex, 1);
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(makeRequestActionAsync.pending, (_, __) => {
                console.log(`req start`);
            })
            .addCase(makeRequestActionAsync.fulfilled, (_, __) => {
                console.log(`req success`);
            })
            .addCase(makeRequestActionAsync.rejected, (_, __) => {
                console.log(`req failed`);
            })
    }
});

export const { resetFormModeAfterDeletion, clearRequestSection, setName, userWantsToEditUrl, userDoneEditingUrl, initQueryItems, updateHeaderName, updateHeaderValue, updateHeaderEnabled, addHeader, removeHeader, populateRequestSection, setMethod, setUrl, updateQueryItemEnabled, updateQueryItemName, updateQueryItemValue, addQueryItem, removeQueryItem } = requestSectionSlice.actions

export const requestSectionReducer = requestSectionSlice.reducer;

export const selectUrl = (state: RootState) => state.requestStore.url;

export const selectMethod = (state: RootState) => state.requestStore.method;

export const selectQuery = (state: RootState) => state.requestStore.query;

export const selectHeaders = (state: RootState) => state.requestStore.headers;

export const selectUserEditingUrl = (state: RootState) => state.requestStore.userEditingUrl;

export const selectUrlTokens = (state: RootState) => state.requestStore.urltokns;

export const selectName = (state: RootState) => state.requestStore.name;

export const selectFormMode = (state: RootState) => state.requestStore.mode;