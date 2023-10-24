import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { v4 as uuidv4 } from "uuid";
import { RequestModel } from "../../types";
import { addtoHistoryAsync } from "../request.history/history.async.actions";
import { determineBodytype, formatCode, readBody } from "../../lib/utils";
import { setResponseMetadata, startLoading } from "../response.section/response.reducer";

export const makeRequestActionAsync = createAsyncThunk<void, void>('request-section/makeRequestActionAsync', async (_, thunkAPI) => {

    const { getState, dispatch } = thunkAPI;

    const rootState = getState() as RootState;

    const { url, method, query, headers } = rootState.requestStore;

    dispatch(startLoading(null));

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

    const start = new Date().getTime();

    const response = await fetch(url, {
        method,
        headers: fetchHeaders,
    });

    const ms = new Date().getTime() - start;

    if (response.ok) {
        const contentTypeHeader = response.headers.get("content-type");
        if (contentTypeHeader) {

            let bodytype = determineBodytype(contentTypeHeader);
            const [size, chunks] = await readBody(response.body);

            if (["js", "json", "text", "html", "xml",].includes(bodytype)) {
                const bodyAsText = new TextDecoder().decode(chunks);
                const body = await formatCode(bodyAsText, bodytype);
                dispatch(setResponseMetadata({
                    body,
                    contentType: bodytype,
                    status: response.status,
                    statusText: response.statusText,
                    size: size,
                    time: ms
                }));
            }
            else {
                //deal with other content types such as img, pdf, csv, zip etc etc.
            }
        }
    }

    dispatch(addtoHistoryAsync(newReqHistoryItem));
});