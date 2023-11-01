import { createAsyncThunk } from "@reduxjs/toolkit";
import { initDatabase, historyRepo, collectionRepo, requestRepo, mimeRepo } from "@/lib/db";
import { populateHistory } from "../../request.history/redux/history.reducer";
import { populateSavedCollections, populateSavedRequests } from "../../request.saved/redux/request.saved.reducer";
import { delay } from "@/lib/utils";


export const initAppDataAsync = createAsyncThunk<boolean, void>("app/initAppDataAsync", async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {

        //cleanup and set indexeddb storage.
        const db = await initDatabase();

        //instantiate repositories
        historyRepo.setDb(db);
        collectionRepo.setDb(db);
        requestRepo.setDb(db);
        mimeRepo.setDb(db);

        const mimeinitSuccess = await mimeRepo.init();

        if (!mimeinitSuccess) {
            throw new Error("app data loading failed");
        }

        //seed operations..
        await collectionRepo.seed();

        //load requests history
        const historyItems = await historyRepo.getAll();
        dispatch(populateHistory(historyItems));

        //load saved collections...
        const collections = await collectionRepo.getAll();
        const defaultCollectionIndex = collections.findIndex(x => x.id === 'default');
        if (defaultCollectionIndex > -1 && defaultCollectionIndex !== 0) {
            const el = collections.splice(defaultCollectionIndex, 1)[0];
            collections.unshift(el);
        }

        dispatch(populateSavedCollections(collections));

        //load saved requests..
        const savedRequests = await requestRepo.getAll();
        dispatch(populateSavedRequests(savedRequests));

        //wait 1 sec artificial delay to avoid flash
        await delay(1000);

        return true;

    } catch (error) {
        console.log(error);
        throw new Error("app data loading failed");
    }
});