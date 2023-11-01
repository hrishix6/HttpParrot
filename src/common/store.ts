import { configureStore } from '@reduxjs/toolkit';
import { historyReducer } from '../components/domain/request.history/redux/history.reducer';
import { themeReducer } from '../components/domain/theme/redux/theme.reducer';
import { requestSectionReducer } from '../components/domain/request.section/redux/request.section.reducer';
import { responseSectionReducer } from '../components/domain/response.section/redux/response.reducer';
import { savedRequestsReducer } from '../components/domain/request.saved/redux/request.saved.reducer';
import { collectionFormReducer } from '../components/domain/request.saved/redux/collection.form.reducer';
import { appReducer } from '../components/domain/app/redux/app.reducer';

export const store = configureStore({
  reducer: {
    app: appReducer,
    historyStore: historyReducer,
    themeStore: themeReducer,
    requestStore: requestSectionReducer,
    responseStore: responseSectionReducer,
    savedRequestsStore: savedRequestsReducer,
    collectionFormStore: collectionFormReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
