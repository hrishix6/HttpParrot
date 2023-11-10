import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/common/store";
import { CollectionVariable, RequestCollectionModel, UpdateEditableItemName, UpdateEditableItemValue } from "@/common/types";
import { v4 as uuidv4 } from 'uuid';
import { saveCollectionAsync } from "./collection.form.async.actions";

export type CollectionFormMode = "update" | "delete" | "idle";

export interface CollectionFormState {
    loading: boolean;
    mode: CollectionFormMode;
    collectionId: string;
    collectionName: string;
    variables: CollectionVariable[]
}


const initialState: CollectionFormState = {
    loading: false,
    mode: "idle",
    collectionId: "",
    collectionName: "",
    variables: [],
};

export const collectionFormSlice = createSlice({
    name: "collection-form",
    initialState,
    reducers: {
        populateForm: (state, action: PayloadAction<{ model: RequestCollectionModel, mode: CollectionFormMode }>) => {
            const { mode, model } = action.payload;
            state.mode = mode;
            state.collectionId = model.id;
            state.collectionName = model.name;
            state.variables = model.variables;
        },
        resetForm: (state) => {
            state.collectionId = "";
            state.collectionName = "";
            state.mode = "idle";
            state.loading = false;
            state.variables = [];
        },
        updateVariableName: (state, action: PayloadAction<UpdateEditableItemName>) => {
            const { id, name } = action.payload;
            const itemIndex = state.variables.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.variables[itemIndex].name = name;
            }
        },
        updateVariableValue: (state, action: PayloadAction<UpdateEditableItemValue>) => {
            const { id, value } = action.payload;
            const itemIndex = state.variables.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.variables[itemIndex].value = value;
            }
        },
        addVariable: (state, _) => {
            state.variables.push({
                id: uuidv4(),
                name: "",
                value: "",
                enabled: false
            });

        },
        removeVariable: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const itemIndex = state.variables.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.variables.splice(itemIndex, 1);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveCollectionAsync.pending, (_, __) => {
                console.log('collection-save started');
            })
            .addCase(saveCollectionAsync.fulfilled, (_, __) => {
                console.log('collection-save success');
            })
            .addCase(saveCollectionAsync.rejected, (_, __) => {
                console.log('collection-save failed');
            });
    }
});

export const { resetForm, populateForm, updateVariableName, updateVariableValue, addVariable, removeVariable } = collectionFormSlice.actions;

export const collectionFormReducer = collectionFormSlice.reducer;

export const selectCollectionFormName = (state: RootState) => state.collectionFormStore.collectionName;

export const selectCollectionFormId = (state: RootState) => state.collectionFormStore.collectionId;

export const selectCollectionFormMode = (state: RootState) => state.collectionFormStore.mode;

export const selectCollectionFormVariables = (state: RootState) => state.collectionFormStore.variables;