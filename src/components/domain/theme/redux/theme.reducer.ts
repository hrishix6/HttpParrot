import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from "@/common/store";

export type Theme = 'dark' | 'light' | 'system';

const storageKey = 'app-theme';

export interface ThemeState {
    theme: Theme
}

const initialState: ThemeState = {
    theme: localStorage.getItem(storageKey) as Theme || 'system'
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            localStorage.setItem(storageKey, action.payload);
            state.theme = action.payload
        }
    }
});

export const { setTheme } = themeSlice.actions;

export const themeReducer = themeSlice.reducer;

export const selectTheme = (state: RootState) => state.themeStore.theme;