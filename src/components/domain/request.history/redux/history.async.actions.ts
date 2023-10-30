import { createAsyncThunk } from "@reduxjs/toolkit";
import { RequestModel } from "@/common/types";
import { historyRepo } from "@/lib/db";

export const addtoHistoryAsync = createAsyncThunk<RequestModel, RequestModel>('history/addtoHistoryAsync', async (model, _) => {
    //try to store request history item in indexedb
    try {
        const id = await historyRepo?.insert(model);
        console.log(`stored item in db with id ${id}`);
    } catch (error) {
        console.log(`couldn't store in indexedDB ${error}`);
    }

    return model;
});

export const loadHistoryFromDbAsync = createAsyncThunk<RequestModel[], void>("history/loadHistoryFromDbAsync", async (_, __) => {

    try {
        let models: RequestModel[] = [];
        if (historyRepo.isInitialized) {
            models = await historyRepo?.getAll();
        }

        return models;

    } catch (error) {
        console.log(`unable to load history items from db: ${error}`);
        return [];
    }
});

export const clearHistoryAsync = createAsyncThunk<void, void>("history/clearHistoryAsync", async (_, __) => {

    try {
        if (historyRepo.isInitialized) {
            await historyRepo?.deleteAll();
        }
    } catch (error) {
        console.log(`couldn't clear history of indexeddb`);
    }
});

export const deleteHistoryItemAsync = createAsyncThunk<string, string>("history/deleteHistoryItemAsync", async (id, _) => {

    try {
        if (historyRepo.isInitialized) {
            await historyRepo?.deleteById(id);
        }
    } catch (error) {
        console.log(`couldn't delete item from history of indexeddb`);
    }

    return id;
});