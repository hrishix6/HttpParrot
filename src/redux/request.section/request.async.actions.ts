import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { v4 as uuidv4 } from "uuid";
import { RequestModel } from "../../types";
import { addToHistory } from "../request.history/history.reducer";


export const makeRequestActionAsync = createAsyncThunk<void, void>('request-section/makeRequestActionAsync', async (_, thunkAPI) => {

    const { getState, dispatch } = thunkAPI;

    const rootState = getState() as RootState;

    const requestInfo = rootState.requestStore;

    const newReqHistoryItem: RequestModel = {
        id: uuidv4(),
        method: requestInfo.method,
        name: requestInfo.url,
        url: requestInfo.url,
        query: requestInfo.query,
        headers: requestInfo.headers,
        triggered: new Date().getTime()
    }

    dispatch(addToHistory(newReqHistoryItem));


});