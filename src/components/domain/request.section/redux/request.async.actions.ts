import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/common/store";
import { v4 as uuidv4 } from "uuid";
import { RequestModel, ResponseHeader, SupportedSnippetLang } from "@/common/types";
import { addtoHistoryAsync } from "../../request.history/redux/history.async.actions";
import { determineBodytypeAsync, formatCode, readBody, substituteURL } from "@/lib/utils";
import { getCodeSnippet } from "@/lib/snippets";
import { setResponseMetadata, startLoading } from "../../response.section/redux/response.reducer";
import { getBody, getBodyWithVariables, getContentType, getHeaders, getHeadersWithVariables } from "../utils/form.helpers";

export const makeRequestActionAsync = createAsyncThunk<void, void>('request-section/makeRequestActionAsync', async (_, thunkAPI) => {

    const { getState, dispatch } = thunkAPI;

    const rootState = getState() as RootState;

    const { url, method, query, headers, formItems, bodyType, enableTextBody, textBody, collectionId } = rootState.requestStore;

    dispatch(startLoading(null));

    let varMap: Record<string, string> = {};
    if (collectionId) {
        const variables = rootState.savedRequestsStore.collections.find(x => x.id === collectionId)?.variables;
        if (variables) {
            varMap = variables.reduce((prev, curr) => {
                prev[curr.name] = curr.value;
                return prev;
            }, {} as Record<string, string>);
        }
    }

    let fetchUrl = url;
    if (collectionId) {
        console.log('substituting  url with variables of collection ', collectionId);
        const urlSubstituted = substituteURL(url, varMap);
        console.log(urlSubstituted);
        fetchUrl = urlSubstituted;
    }

    let fetchHeaders: Record<string, any> = {};
    if (collectionId) {
        console.log('substituting headers with variables of collection ', collectionId);
        fetchHeaders = getHeadersWithVariables(headers, varMap);
    }
    else {
        fetchHeaders = getHeaders(headers);
    }

    let fetchBody;
    if (method !== "get") {
        const bodyCfg = { bodyType, formItems, bodyTextEnabled: enableTextBody, bodyText: textBody };
        if (collectionId) {
            console.log('substituting body with variables of collection ', collectionId);
            fetchBody = getBodyWithVariables(bodyCfg, varMap);
        }
        else {
            fetchBody = getBody(bodyCfg);
        }
        //since fetch automatically adds correct header when body is formdata.
        if (bodyType !== "formdata") {
            fetchHeaders["content-type"] = getContentType(bodyType);
        }
    }

    const start = new Date().getTime();

    const abortController = new AbortController();

    setTimeout(() => {
        //kill request after 30 seconds.
        abortController.abort();
    }, 30000);

    try {
        const response = await fetch(fetchUrl, {
            method,
            headers: fetchHeaders,
            signal: abortController.signal,
            ...(method !== "get" ? { body: fetchBody } : { body: null })
        });

        const ms = new Date().getTime() - start;

        const responseheaders: ResponseHeader[] = [];

        for (let [resKey, resVal] of response.headers.entries()) {
            responseheaders.push({ name: resKey, value: resVal });
        }

        const contentTypeHeader = response.headers.get("content-type");
        const [size, chunks] = await readBody(response.body);

        if (contentTypeHeader) {

            let mimeRecord = await determineBodytypeAsync(contentTypeHeader);
            let extension = mimeRecord.extensions[0];

            if (["js", "json", "html", "xml",].includes(extension)) {
                const bodyAsText = new TextDecoder().decode(chunks);
                const body = await formatCode(bodyAsText, extension);
                dispatch(setResponseMetadata({
                    mimeType: mimeRecord.id,
                    body,
                    contentType: extension,
                    status: response.status,
                    statusText: response.statusText,
                    size: size,
                    time: ms,
                    headers: responseheaders,
                    ok: response.ok
                }));
            }
            else {
                dispatch(setResponseMetadata({
                    mimeType: mimeRecord.id,
                    body: chunks,
                    contentType: extension,
                    status: response.status,
                    statusText: response.statusText,
                    size: size,
                    time: ms,
                    headers: responseheaders,
                    ok: response.ok
                }));
            }
        }
        else {
            dispatch(setResponseMetadata({
                mimeType: "application/octet-stream",
                body: chunks,
                contentType: "unknown",
                headers: responseheaders,
                ok: response.ok,
                size: size,
                time: ms,
                status: response.status,
                statusText: response.statusText
            }));
        }
    } catch (error) {
        dispatch(setResponseMetadata({
            mimeType: "application/octet-stream",
            body: null,
            contentType: "unknown",
            headers: [],
            ok: false,
            size: 0,
            time: 0,
            status: 0,
            statusText: ""
        }));
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


export const generateCodeSnippetAsync = createAsyncThunk<void, SupportedSnippetLang>("request-section/generateCurlSnippet", async (lang, thunkAPI) => {

    const { getState } = thunkAPI;
    const rootState = getState() as RootState;
    const requestForm = rootState.requestStore;

    const codeSnippet = getCodeSnippet(requestForm, lang);

    console.log(codeSnippet);
});