import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/common/store'
import { HistoryState } from "./history.types";
import { addtoHistoryAsync, clearHistoryAsync, deleteHistoryItemAsync } from './history.async.actions';
import { RequestModel } from '@/common/types';

const initialState: HistoryState = {
    history: [],
    filter: ''
};

export const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        populateHistory: (state, action: PayloadAction<RequestModel[]>) => {
            state.history = action.payload;
        },
        setFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addtoHistoryAsync.fulfilled, (state, action) => {
                state.history.unshift(action.payload);
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

export const { setFilter, populateHistory } = historySlice.actions;

export const historyReducer = historySlice.reducer;

export const selectFilter = (state: RootState) => state.historyStore.filter;

export const selectHistory = (state: RootState) => state.historyStore.history;