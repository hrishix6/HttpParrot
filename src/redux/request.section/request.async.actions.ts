import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { v4 as uuidv4 } from "uuid";
import { ContentType, RequestModel } from "../../types";
import { addtoHistoryAsync } from "../request.history/history.async.actions";
import { determineBodytype, formatCode } from "../../lib/utils";
import { setResponseMetadata } from "../response.section/response.reducer";

export const makeRequestActionAsync = createAsyncThunk<void, void>('request-section/makeRequestActionAsync', async (_, thunkAPI) => {

    const { getState, dispatch } = thunkAPI;

    const rootState = getState() as RootState;

    const { url, method, query, headers } = rootState.requestStore;


    const newReqHistoryItem: RequestModel = {
        id: uuidv4(),
        method,
        name: url,
        url: url,
        query: query,
        headers: headers,
        triggered: new Date().getTime()
    }

    const fetchHeaders: Record<string, any> = {};
    for (const h of headers) {
        if (h.enabled) {
            if (h.name && h.value) {
                fetchHeaders[h.name] = h.value;
            }
        }
    }

    const response = await fetch(url, {
        method,
        headers: fetchHeaders,
    });

    if (response.ok) {
        const contentTypeHeader = response.headers.get("content-type");
        let body: any;
        let bodytype: ContentType = "unknown";
        if (contentTypeHeader) {
            bodytype = determineBodytype(contentTypeHeader);

            if (["js", "json", "text", "html", "xml",].includes(bodytype)) {
                const unformatted = await response.text();
                body = await formatCode(unformatted, bodytype)
            }
            else {
                body = await response.blob();
            }
        }
        dispatch(setResponseMetadata({
            body,
            contentType: bodytype,
            status: response.status,
            statusText: response.statusText,
            size: 0,
            time: 0
        }));

    }

    dispatch(addtoHistoryAsync(newReqHistoryItem));

});