import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from "@/common/store";
import { THEME_LOCAL_STORAGE_KEY } from "@/lib/constants";

export type Theme = 'dark' | 'light' | 'system';

export interface ThemeState {
    theme: Theme
}

const initialState: ThemeState = {
    theme: localStorage.getItem(THEME_LOCAL_STORAGE_KEY) as Theme || 'system'
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            localStorage.setItem(THEME_LOCAL_STORAGE_KEY, action.payload);
            state.theme = action.payload
        }
    }
});

export const { setTheme } = themeSlice.actions;

export const themeReducer = themeSlice.reducer;

export const selectTheme = (state: RootState) => state.themeStore.theme;