import { createAsyncThunk } from "@reduxjs/toolkit";
import { RequestCollectionModel } from "@/common/types";
import { collectionRepo } from "@/lib/db";
import { resetForm } from "./collection.form.reducer";
import { RootState } from "../../../../common/store";
import { updateCollection } from "./request.saved.reducer";


export const saveCollectionAsync = createAsyncThunk<void, string>(
    'collection-form/saveCollectionAsync',
    async (newName, thunkAPI) => {
        //try to store request history item in indexedb
        const { dispatch, getState } = thunkAPI;

        const root = getState() as RootState;

        const { collectionFormStore } = root;

        const model2Save: RequestCollectionModel = {
            id: collectionFormStore.collectionId,
            name: newName,
            variables: collectionFormStore.variables,
            created: new Date().getTime()
        };

        try {
            await collectionRepo?.updateById(model2Save);
        } catch (error) {
            console.log(`couldn't update in indexedDB ${error}`);
        } finally {
            //clear the collection form.
            dispatch(resetForm());
            dispatch(updateCollection(model2Save));
        }

    });

