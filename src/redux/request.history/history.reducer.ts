import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { HistoryState } from "./history.types";
import { addtoHistoryAsync, loadHistoryFromDbAsync, clearHistoryAsync, deleteHistoryItemAsync } from './history.async.actions';

const initialState: HistoryState = {
    loading: false,
    history: [],
    filter: ''
};

export const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addtoHistoryAsync.fulfilled, (state, action) => {
                state.history.unshift(action.payload);
            })
            .addCase(loadHistoryFromDbAsync.pending, (state, _) => {
                state.loading = true;
            })
            .addCase(loadHistoryFromDbAsync.fulfilled, (state, action) => {
                state.history = action.payload;
                state.loading = false;
            })
            .addCase(loadHistoryFromDbAsync.rejected, (state, _) => {
                state.loading = false;
            })
            .addCase(clearHistoryAsync.fulfilled, (state, _) => {
                state.history = [];
            })
            .addCase(deleteHistoryItemAsync.fulfilled, (state, action) => {
                const id = action.payload;
                const itemIndex = state.history.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    state.history.splice(itemIndex, 1);
                }
            });;
    }
});

export const { setFilter } = historySlice.actions;

export const historyReducer = historySlice.reducer;

export const selectFilter = (state: RootState) => state.historyStore.filter;

export const selectHistory = (state: RootState) => state.historyStore.history;