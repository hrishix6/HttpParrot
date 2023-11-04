import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/common/store";
import { v4 as uuidv4 } from "uuid";
import { RequestModel, SupportedSnippetLang } from "@/common/types";
import { addtoHistoryAsync } from "../../request.history/redux/history.async.actions";
import { toFetchConfig, getContentTypeHeader } from "@/lib/utils";
import { getCodeSnippet } from "@/lib/snippets";
import { setResponseMetadata, clearResponse } from "../../response.section/redux/response.reducer";
import { toResponseModel } from "@/lib/response.utils";
import { setLoading, stopLoading } from "./request.section.reducer";

export const makeRequestActionAsync = createAsyncThunk<void, void>('request-section/makeRequestActionAsync', async (_, thunkAPI) => {

    const { getState, dispatch } = thunkAPI;

    const rootState = getState() as RootState;

    const { method, query, headers, formItems, bodyType, enableTextBody, textBody } = rootState.requestStore;

    const { url: fetchUrl, ...fetchConfig } = toFetchConfig(rootState);

    if (bodyType !== "formdata") {
        fetchConfig.headers["content-type"] = getContentTypeHeader(bodyType);
    }

    const start = new Date().getTime();
    const abortController = new AbortController();

    dispatch(setLoading(abortController));
    dispatch(clearResponse(null));

    try {
        const response = await fetch(fetchUrl, {
            ...fetchConfig,
            signal: abortController.signal,
        });

        const ms = new Date().getTime() - start;

        const responseModel = await toResponseModel(response);

        dispatch(setResponseMetadata({ ...responseModel, time: ms }));

    } catch (error) {
        dispatch(stopLoading());
        console.log(error);
    }

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
});

export const abortOngoingRequestAsync = createAsyncThunk<void, void>("request-section/abortOngoingRequestAsync", async (_, thunkAPI) => {
    const { getState } = thunkAPI;
    const rootState = getState() as RootState;
    const aborter = rootState.requestStore.aborter;
    aborter?.abort();
});


export const generateCodeSnippetAsync = createAsyncThunk<void, SupportedSnippetLang>("request-section/generateCurlSnippet", async (lang, thunkAPI) => {

    const { getState } = thunkAPI;
    const rootState = getState() as RootState;
    const requestForm = rootState.requestStore;

    const codeSnippet = getCodeSnippet(requestForm, lang);

    console.log(codeSnippet);
});