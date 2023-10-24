import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CollectionDatabase, HistoryDatabase } from "./db";

export interface StorageState {
    historydb: HistoryDatabase | null,
    collectiondb: CollectionDatabase | null
}

const initialState: StorageState = {
    historydb: null,
    collectiondb: null
};


const storageSlice = createSlice({
    name: "storage",
    initialState,
    reducers: {
        setProviders: (state, action: PayloadAction<StorageState>) => {
            const { collectiondb, historydb } = action.payload;
            state.collectiondb = collectiondb;
            state.historydb = historydb;
        }
    }
});

export const storageReducer = storageSlice.reducer;

export const { setProviders } = storageSlice.actions;

export const selectHistoryDb = (state: RootState) => state.storage.historydb;

export const selectCollectionDb = (state: RootState) => state.storage.collectiondb;