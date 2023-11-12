import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/common/store";
import { RequestCollectionModel, RequestModel } from "@/common/types";
import { addNewCollectionAsync, saveRequestAsync, deleteSavedRequestByIdAsync, deleteSavedRequestsAsync, deleteCollectionAsync, saveRequestCopyAsync } from "./request.saved.async.actions";

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
        importCollection: (state, action: PayloadAction<RequestCollectionModel>) => {
            state.collections.push(action.payload);
        },
        importRequests: (state, action: PayloadAction<RequestModel[]>) => {
            state.saved.push(...action.payload);
        },
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
                const { mode, model } = action.payload;
                if (mode == "insert") {
                    state.saved.unshift(model);
                }
                else {
                    const itemIndex = state.saved.findIndex(x => x.id === model.id);
                    if (itemIndex > -1) {
                        state.saved[itemIndex] = model;
                    }
                    else {
                        state.saved.push(model);
                    }
                }
            })
            .addCase(saveRequestCopyAsync.fulfilled, (state, action) => {
                state.saved.push(action.payload);
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
            })
            .addCase(deleteCollectionAsync.fulfilled, (state, action) => {
                const { collectionId, reqIds } = action.payload;

                const collectIndex = state.collections.findIndex(x => x.id === collectionId);
                if (collectIndex > -1) {
                    state.collections.splice(collectIndex, 1);
                }
                const newSavedRequests = state.saved.filter(x => !reqIds.includes(x.id));
                state.saved = newSavedRequests;
            });
    }
});


export const { importRequests, importCollection, setFilter, updateCollection, populateSavedCollections, populateSavedRequests } = savedRequestsSlice.actions;

export const savedRequestsReducer = savedRequestsSlice.reducer;

export const selectFilter = (state: RootState) => state.savedRequestsStore.filter;

export const selectSavedRequests = (state: RootState) => state.savedRequestsStore.saved;

export const selectCollections = (state: RootState) => state.savedRequestsStore.collections;