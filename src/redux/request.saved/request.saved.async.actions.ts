import { createAsyncThunk } from "@reduxjs/toolkit";
import { RequestModel } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { collectionDB } from "../../lib/db";
import { RootState } from "../store";
import { RequestFormMode, clearRequestSection } from "../request.section/request.section.reducer";


export const saveRequestAsync = createAsyncThunk<{ model: RequestModel, mode: RequestFormMode }, string>('saved-requests/saveRequestAsync', async (newName, thunkAPI) => {
    //try to store request history item in indexedb

    const { getState, dispatch } = thunkAPI;

    const rootState = getState() as RootState;

    const { url, query, headers, method, id, mode } = rootState.requestStore;

    if (mode == "insert") {
        const requestModel: RequestModel = {
            id: uuidv4(),
            name: newName,
            headers,
            url,
            query,
            method,
            triggered: new Date().getTime(),
            created: new Date().getTime(),
        }

        try {
            const id = await collectionDB?.insert(requestModel);
            console.log(`stored item in db with id ${id}`);
        } catch (error) {
            console.log(`couldn't store in indexedDB ${error}`);
        }
        finally {
            dispatch(clearRequestSection());
        }

        return { mode: "insert", model: requestModel };
    }
    else {
        const requestModel: RequestModel = {
            id: id,
            name: newName,
            headers,
            url,
            query,
            method,
            triggered: new Date().getTime(),
            created: new Date().getTime(),
        }

        try {
            const updatedId = await collectionDB?.updateById(requestModel);
            console.log(`stored item in db with id ${updatedId}`);
        } catch (error) {
            console.log(`couldn't store in indexedDB ${error}`);
        }
        finally {
            dispatch(clearRequestSection());
        }

        return { mode: "update", model: requestModel };

    }
});

export const loadSavedRequestsAsync = createAsyncThunk<RequestModel[], void>("saved-requests/loadSavedRequestsAsync", async (_, __) => {

    try {
        let models: RequestModel[] = [];
        if (collectionDB.isInitialized) {
            models = await collectionDB?.getAll();
        }

        return models;

    } catch (error) {
        console.log(`unable to load request items from db: ${error}`);
        return [];
    }
});

export const deleteSavedRequestsAsync = createAsyncThunk<void, void>("saved-requests/deleteSavedRequestsAsync", async (_, __) => {

    try {
        if (collectionDB.isInitialized) {
            await collectionDB?.deleteAll();
        }
    } catch (error) {
        console.log(`couldn't clear saved requests of indexeddb`);
    }
});

export const deleteSavedRequestByIdAsync = createAsyncThunk<string, string>("saved-requests/deleteSavedRequestByIdAsync", async (id, _) => {

    try {
        if (collectionDB.isInitialized) {
            await collectionDB?.deleteById(id);
        }
    } catch (error) {
        console.log(`couldn't delete item from requests of indexeddb`);
    }

    return id;
});