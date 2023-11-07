import { createAsyncThunk } from "@reduxjs/toolkit";
import { RequestCollectionModel, RequestModel, RequestFormMode } from "@/common/types";
import { v4 as uuidv4 } from "uuid";
import { collectionRepo, requestRepo } from "@/lib/db";
import { RootState } from "@/common/store";


export const saveRequestAsync = createAsyncThunk<{ model: RequestModel, mode: RequestFormMode }, { name: string, collectionId: string, tabId: string }>('saved-requests/saveRequestAsync', async (arg, thunkAPI) => {
    //try to store request history item in indexedb

    const { getState } = thunkAPI;

    const { name: newName, collectionId, tabId } = arg;

    const rootState = getState() as RootState;

    const tabData = rootState.tabsStore.tabData[tabId];

    const { url, query, headers, method, id, mode, bodyType, textBody, enableTextBody, formItems } = tabData;

    if (mode == "insert") {
        const requestModel: RequestModel = {
            id: uuidv4(),
            name: newName,
            collectionId,
            headers,
            url,
            query,
            method,
            triggered: new Date().getTime(),
            created: new Date().getTime(),
            ...(method !== "get" ? {
                bodytype: bodyType,
                textBody: textBody,
                enableTextBody: enableTextBody,
                formItems
            } : {})
        }

        try {
            const id = await requestRepo?.insert(requestModel);
            console.log(`stored item in db with id ${id}`);
        } catch (error) {
            console.log(`couldn't store in indexedDB ${error}`);
        }
        finally {
            // dispatch(clearRequestSection());
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
            collectionId,
            triggered: new Date().getTime(),
            created: new Date().getTime(),
            ...(method !== "get" ? {
                bodytype: bodyType,
                textBody: textBody,
                enableTextBody: enableTextBody,
                formItems
            } : {})
        }

        try {
            const updatedId = await requestRepo?.updateById(requestModel);
            console.log(`stored item in db with id ${updatedId}`);
        } catch (error) {
            console.log(`couldn't store in indexedDB ${error}`);
        }
        finally {
            // dispatch(clearRequestSection());
        }

        return { mode: "update", model: requestModel };

    }
});

export const deleteSavedRequestsAsync = createAsyncThunk<void, void>("saved-requests/deleteSavedRequestsAsync", async (_, __) => {
    try {
        if (requestRepo.isInitialized) {
            await requestRepo?.deleteAll();
        }
    } catch (error) {
        console.log(`couldn't clear saved requests of indexeddb`);
    }
});

export const deleteSavedRequestByIdAsync = createAsyncThunk<string, string>("saved-requests/deleteSavedRequestByIdAsync", async (id, _) => {
    try {
        if (requestRepo.isInitialized) {
            await requestRepo?.deleteById(id);
        }
    } catch (error) {
        console.log(`couldn't delete item from requests of indexeddb`);
    }

    return id;
});

export const addNewCollectionAsync = createAsyncThunk<RequestCollectionModel, string>('saved-requests/addNewCollectionAsync', async (newName, _) => {

    const newCollection: RequestCollectionModel = {
        id: uuidv4(),
        name: newName,
        variables: [],
        created: new Date().getTime()
    }

    try {
        const id = await collectionRepo?.insert(newCollection);
        console.log(`stored item in db with id ${id}`);
    } catch (error) {
        console.log(`couldn't store in indexedDB ${error}`);
    }
    return newCollection;
})