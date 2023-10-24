import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ContentType, ResponseModel } from "../../types";
export interface ResponseSectionState {
    status: string,
    size: string,
    time: string,
    body: any,
    bodyType: ContentType
}

const initialState: ResponseSectionState = {
    status: "",
    size: "",
    time: "",
    body: "",
    bodyType: "unknown"
};


const responseSlice = createSlice({
    name: "response-section",
    initialState,
    reducers: {
        setResponseMetadata: (state, action: PayloadAction<ResponseModel>) => {
            const { size, status, time, contentType, statusText, body } = action.payload;
            state.status = `${status} ${statusText}`;
            state.size = `${size} bytes`;
            state.time = `${time} ms`;
            state.bodyType = contentType;
            state.body = body;
        }
    }
});

export const { setResponseMetadata } = responseSlice.actions;

export const responseSectionReducer = responseSlice.reducer;

export const selectResponseMetadata = (state: RootState) => {
    return {
        status: state.responseStore.status,
        size: state.responseStore.size,
        time: state.responseStore.time
    }
};

export const selectResponseBodyMetadata = (state: RootState) => {
    return {
        body: state.responseStore.body,
        bodyType: state.responseStore.bodyType
    }
}
