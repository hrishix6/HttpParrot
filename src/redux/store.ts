import { configureStore } from '@reduxjs/toolkit'
import { historyReducer } from "./request.history/history.reducer";
import { themeReducer } from './theme/theme.reducer';
import { requestSectionReducer } from './request.section/request.section.reducer';

export const store = configureStore({
    reducer: {
        historyStore: historyReducer,
        themeStore: themeReducer,
        requestStore: requestSectionReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch