import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RequestModel } from "../../types";
import { saveRequestAsync, loadSavedRequestsAsync, deleteSavedRequestByIdAsync, deleteSavedRequestsAsync } from "./request.saved.async.actions";



export interface RequestSavedState {
    loading: boolean
    saved: RequestModel[],
    filter: string
}


const initialState: RequestSavedState = {
    loading: false,
    saved: [],
    filter: ''
};

export const savedRequestsSlice = createSlice({
    name: "saved-requests",
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveRequestAsync.fulfilled, (state, action) => {
                console.log('populated new item in saved requests');
                const { mode, model } = action.payload;
                if (mode == "insert") {
                    state.saved.unshift(model);
                }
                else {
                    const itemIndex = state.saved.findIndex(x => x.id === model.id);
                    if (itemIndex > -1) {
                        state.saved[itemIndex] = model;
                    }
                }
            })
            .addCase(loadSavedRequestsAsync.pending, (state, _) => {
                state.loading = true;
            })
            .addCase(loadSavedRequestsAsync.fulfilled, (state, action) => {
                state.saved = action.payload;
                state.loading = false;
            })
            .addCase(loadSavedRequestsAsync.rejected, (state, _) => {
                state.loading = false;
            })
            .addCase(deleteSavedRequestsAsync.fulfilled, (state, _) => {
                state.saved = [];
            })
            .addCase(deleteSavedRequestByIdAsync.fulfilled, (state, action) => {
                const id = action.payload;
                const itemIndex = state.saved.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    state.saved.splice(itemIndex, 1);
                }
            });;
    }
});


export const { setFilter } = savedRequestsSlice.actions;

export const savedRequestsReducer = savedRequestsSlice.reducer;

export const selectFilter = (state: RootState) => state.savedRequestsStore.filter;

export const selectSavedRequests = (state: RootState) => state.savedRequestsStore.saved;