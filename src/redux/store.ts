import { configureStore } from '@reduxjs/toolkit'
import { historyReducer } from "./request.history/history.reducer";
import { themeReducer } from './theme/theme.reducer';
import { requestSectionReducer } from './request.section/request.section.reducer';
import { responseSectionReducer } from './response.section/response.reducer';
import { savedRequestsReducer } from './request.saved/request.saved.reducer';

export const store = configureStore({
    reducer: {
        historyStore: historyReducer,
        themeStore: themeReducer,
        requestStore: requestSectionReducer,
        responseStore: responseSectionReducer,
        savedRequestsStore: savedRequestsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch