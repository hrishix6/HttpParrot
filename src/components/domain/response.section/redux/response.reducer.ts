import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/common/store";
import { ResponseModel, ResponseHeader } from "@/common/types";

export interface ResponseSectionState {
    status: string,
    size: string,
    time: string,
    body: any,
    bodyType: string
    headers: ResponseHeader[],
    ok: boolean;
    mimeType: string;
}

const initialState: ResponseSectionState = {
    mimeType: "",
    status: "",
    size: "",
    time: "",
    body: "",
    bodyType: "unknown",
    headers: [],
    ok: false,
};


const responseSlice = createSlice({
    name: "response-section",
    initialState,
    reducers: {
        setResponseMetadata: (state, action: PayloadAction<ResponseModel>) => {
            const { size, status, time, contentType, statusText, body, headers, ok, mimeType } = action.payload;
            state.status = status ? `${status} ${statusText}` : "";
            state.size = size ? `${size} bytes` : "";
            state.time = time ? `${time} ms` : "";
            state.bodyType = contentType;
            state.body = body;
            state.headers = headers;
            state.ok = ok;
            state.mimeType = mimeType;
        },
        startLoading: (state) => {
            state.status = "";
            state.size = "";
            state.time = "";
            state.body = "";
            state.bodyType = "unknown";
            state.headers = [];
            state.ok = false;
            state.mimeType = "";
        },
        clearResponse: (state, _) => {
            state.status = "";
            state.size = "";
            state.time = "";
            state.body = "";
            state.bodyType = "unknown";
            state.headers = [];
            state.ok = false;
            state.mimeType = "";
        },
        discardBody: (state, _) => {
            state.body = ""
            state.bodyType = "unknown";
            state.mimeType = ""
        },
    }
});

export const { setResponseMetadata, startLoading, clearResponse, discardBody } = responseSlice.actions;

export const responseSectionReducer = responseSlice.reducer;
export const selectResponseStatus = (state: RootState) => state.responseStore.status;
export const selectResponseSize = (state: RootState) => state.responseStore.size;
export const selectResponseTime = (state: RootState) => state.responseStore.time;
export const selectIfResponseOk = (state: RootState) => state.responseStore.ok;
export const selectResponseBody = (state: RootState) => state.responseStore.body;
export const selectResponseBodytype = (state: RootState) => state.responseStore.bodyType;
export const selectResponseHeaders = (state: RootState) => state.responseStore.headers;
export const selectMimeType = (state: RootState) => state.responseStore.mimeType;