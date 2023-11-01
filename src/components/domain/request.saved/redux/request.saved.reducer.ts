import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/common/store";
import { RequestCollectionModel, RequestModel } from "@/common/types";
import { addNewCollectionAsync, saveRequestAsync, deleteSavedRequestByIdAsync, deleteSavedRequestsAsync } from "./request.saved.async.actions";

export interface RequestSavedState {
    collections: RequestCollectionModel[]
    saved: RequestModel[],
    filter: string
}


const initialState: RequestSavedState = {
    saved: [],
    collections: [],
    filter: ''
};

export const savedRequestsSlice = createSlice({
    name: "saved-requests",
    initialState,
    reducers: {
        populateSavedRequests: (state, action: PayloadAction<RequestModel[]>) => {
            state.saved = action.payload;
        },
        populateSavedCollections: (state, action: PayloadAction<RequestCollectionModel[]>) => {
            state.collections = action.payload;
        },
        setFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },

        updateCollection: (state, action: PayloadAction<RequestCollectionModel>) => {
            const { id, name, variables } = action.payload;
            const itemIndex = state.collections.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.collections[itemIndex].name = name;
                state.collections[itemIndex].variables = variables;
            }
        }

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
            .addCase(deleteSavedRequestsAsync.fulfilled, (state, _) => {
                state.saved = [];
            })
            .addCase(deleteSavedRequestByIdAsync.fulfilled, (state, action) => {
                const id = action.payload;
                const itemIndex = state.saved.findIndex(x => x.id === id);
                if (itemIndex > -1) {
                    state.saved.splice(itemIndex, 1);
                }
            }).addCase(addNewCollectionAsync.fulfilled, (state, action) => {
                state.collections.push(action.payload);
            }).addCase(addNewCollectionAsync.pending, (_, __) => {
                console.log('adding item to collection');
            }).addCase(addNewCollectionAsync.rejected, (_, __) => {
                console.log("failed to add collection");
            });
    }
});


export const { setFilter, updateCollection, populateSavedCollections, populateSavedRequests } = savedRequestsSlice.actions;

export const savedRequestsReducer = savedRequestsSlice.reducer;

export const selectFilter = (state: RootState) => state.savedRequestsStore.filter;

export const selectSavedRequests = (state: RootState) => state.savedRequestsStore.saved;

export const selectCollections = (state: RootState) => state.savedRequestsStore.collections;