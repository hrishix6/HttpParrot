import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { HistoryState } from "./history.types";
import { RequestModel } from '../../types';

const initialState: HistoryState = {
    history: [],
    filteredHistory: [],
    filter: ''
};

export const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
        setFilteredHistory: (state, action: PayloadAction<RequestModel[]>) => {
            state.filteredHistory = action.payload;
        },
        addToHistory: (state, action: PayloadAction<RequestModel>) => {
            state.history.unshift(action.payload);
        },
        deleteHistoryItem: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const itemIndex = state.history.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.history.splice(itemIndex, 1);
            }
        },
        clearHistory: (state) => {
            state.history = [];
        }
    }
});

export const { clearHistory, setFilter, setFilteredHistory, addToHistory, deleteHistoryItem } = historySlice.actions;

export const historyReducer = historySlice.reducer;

export const selectFilteredHistory = (state: RootState) => state.historyStore.filteredHistory;

export const selectFilter = (state: RootState) => state.historyStore.filter;

export const selectHistory = (state: RootState) => state.historyStore.history;