import { createAsyncThunk } from "@reduxjs/toolkit";
import { RequestCollectionModel, RequestModel, RequestFormMode } from "@/common/types";
import { v4 as uuidv4 } from "uuid";
import { collectionRepo, requestRepo } from "@/lib/db";
import { RootState } from "@/common/store";
import { importCollection } from "@/lib/import.export.utils";
import { importCollection as impCollection, importRequests } from "./request.saved.reducer";

export const saveRequestAsync = createAsyncThunk<{ model: RequestModel, mode: RequestFormMode }, { name: string, collectionId: string, tabId: string }>('saved-requests/saveRequestAsync', async (arg, thunkAPI) => {
    const { getState } = thunkAPI;

    const { name: newName, collectionId, tabId } = arg;

    const rootState = getState() as RootState;

    const tabData = rootState.tabsStore.tabData[tabId];

    const { url, query, headers, method, id, bodyType, textBody, enableTextBody, formItems, mode, authConfig } = tabData;

    const modelId = mode == "insert" ? uuidv4() : id;

    const model: RequestModel = {
        id: modelId,
        name: newName ? newName : "unnamed",
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
        } : {}),
        auth: { ...authConfig }
    };

    try {
        await requestRepo.updateById(model);
    } catch (error) {
        console.log(`couldn't store in indexedDB ${error}`);
    }

    return { mode, model };
});

export const saveRequestCopyAsync = createAsyncThunk<RequestModel, { name: string, collectionId: string, tabId: string }>("saved-requests/saveRequestCopyAsync", async (arg, thunkAPI) => {

    const { getState } = thunkAPI;

    const { name: newName, collectionId, tabId } = arg;

    const rootState = getState() as RootState;

    const tabData = rootState.tabsStore.tabData[tabId];

    const { url, query, headers, method, bodyType, textBody, enableTextBody, formItems, authConfig } = tabData;

    const model: RequestModel = {
        id: uuidv4(),
        name: newName ? newName : "unnamed",
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
        } : {}),
        auth: { ...authConfig }
    };

    try {
        await requestRepo.updateById(model);
    } catch (error) {
        console.log(`couldn't store in indexedDB ${error}`);
    }

    return model;
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
        await collectionRepo?.insert(newCollection);
    } catch (error) {
        console.log(`couldn't store in indexedDB ${error}`);
    }
    return newCollection;
});

export const importCollectionAsync = createAsyncThunk<void, any>('saved-requests/importCollectionAsync', async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const payload = await importCollection(arg);
    if (!payload) {
        return;
    }

    const { collection, requests } = payload;

    try {
        const insertedC = await collectionRepo.insert(collection);
        if (insertedC) {
            dispatch(impCollection(collection));
        }
    } catch (error) {
        console.log("couldn't save collection.");
    }

    try {
        const insertReqs = await requestRepo.insertMany(requests);
        if (insertReqs) {
            dispatch(importRequests(requests));
        }
    } catch (error) {
        console.log("couldn't save requests.");
    }

});

export const deleteCollectionAsync = createAsyncThunk<{ reqIds: string[], collectionId: string }, string>('saved-requests/deleteCollectionAsync', async (arg, thunkAPI) => {

    const { getState } = thunkAPI;

    const rootState = getState() as RootState;

    const requests2Delete = rootState.savedRequestsStore.saved.filter(x => x.collectionId === arg);
    const reqIds = requests2Delete.map(x => x.id);

    try {
        await requestRepo.deleteMultiple(reqIds);
    } catch (error) {
        console.log("couldn't delete requests from db");
    }

    try {
        await collectionRepo.deleteById(arg);
    } catch (error) {
        console.log("couldn't delete collection from db....");
    }

    return {
        reqIds,
        collectionId: arg
    };
});

