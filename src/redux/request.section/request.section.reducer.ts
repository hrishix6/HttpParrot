import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../store";
import { makeRequestActionAsync } from "./request.async.actions";
import { UpdateHeaderName, UpdateHeaderValue, UpdateHeaderEnabled, QueryItem, HeaderItem, RequestMethod, UpdateQueryItemName, UpdateQueryItemValue, UpdateQueryItemEnabled, RequestModel } from "../../types";

export interface RequestSectionState {
    method: RequestMethod,
    url: string,
    query: QueryItem[],
    headers: HeaderItem[],
    userEditingUrl: boolean,
}


const initialState: RequestSectionState = {
    userEditingUrl: false,
    method: "get",
    url: '',
    query: [],
    headers: [{
        id: uuidv4(),
        name: 'Accept',
        value: "*/*",
        enabled: true,
    }]
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

const requestSectionSlice = createSlice({
    name: "request-section",
    initialState,
    reducers: {
        populateRequestSection: (state, action: PayloadAction<RequestModel>) => {
            const { url, query, headers, method } = action.payload;
            state.method = method;
            state.query = query;
            state.headers = headers;
            state.url = url;
        },
        setMethod: (state, action: PayloadAction<RequestMethod>) => {
            state.method = action.payload;
        },
        setUrl: (state, action: PayloadAction<string>) => {
            state.userEditingUrl = true;
            state.url = action.payload;
        },

        userDoneEditingUrl: (state) => {
            state.userEditingUrl = false;
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

            }
        },
        updateQueryItemValue: (state, action: PayloadAction<UpdateQueryItemValue>) => {
            const { id, value } = action.payload;
            const itemIndex = state.query.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.query[itemIndex].value = value;
                const queryStr = getQueryString(state.query);
                state.url = getUpdatedUrl(state.url, queryStr);

            }
        },
        updateQueryItemEnabled: (state, action: PayloadAction<UpdateQueryItemEnabled>) => {
            const { id } = action.payload;
            const itemIndex = state.query.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.query[itemIndex].enabled = !state.query[itemIndex].enabled;
                const queryStr = getQueryString(state.query);
                state.url = getUpdatedUrl(state.url, queryStr);

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

export const { userDoneEditingUrl, initQueryItems, updateHeaderName, updateHeaderValue, updateHeaderEnabled, addHeader, removeHeader, populateRequestSection, setMethod, setUrl, updateQueryItemEnabled, updateQueryItemName, updateQueryItemValue, addQueryItem, removeQueryItem } = requestSectionSlice.actions

export const requestSectionReducer = requestSectionSlice.reducer;

export const selectUrl = (state: RootState) => state.requestStore.url;

export const selectMethod = (state: RootState) => state.requestStore.method;

export const selectQuery = (state: RootState) => state.requestStore.query;

export const selectHeaders = (state: RootState) => state.requestStore.headers;

export const selectUserEditingUrl = (state: RootState) => state.requestStore.userEditingUrl;
