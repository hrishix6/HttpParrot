import { configureStore } from '@reduxjs/toolkit';
import { historyReducer } from '../components/domain/request.history/redux/history.reducer';
import { themeReducer } from '../components/domain/theme/redux/theme.reducer';
import { tabsReducer } from "../components/domain/tabs/redux/tabs.reducer";
import { savedRequestsReducer } from '../components/domain/request.saved/redux/request.saved.reducer';
import { collectionFormReducer } from '../components/domain/request.saved/redux/collection.form.reducer';
import { appReducer } from '../components/domain/app/redux/app.reducer';

export const store = configureStore({
  reducer: {
    app: appReducer,
    historyStore: historyReducer,
    themeStore: themeReducer,
    savedRequestsStore: savedRequestsReducer,
    collectionFormStore: collectionFormReducer,
    tabsStore: tabsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
