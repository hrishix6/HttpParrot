import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { initAppDataAsync } from './app.async.actions';
import { RootState } from '@/common/store';

interface AppState {
  loading: boolean;
  error: boolean;
  mobileSidebar: boolean;
}

const initialState: AppState = {
  loading: true,
  error: false,
  mobileSidebar: false
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleMobileSidebar: (state, action: PayloadAction<boolean>) => {
      state.mobileSidebar = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAppDataAsync.rejected, (state, _) => {
        state.error = true;
        state.loading = false;
      })
      .addCase(initAppDataAsync.fulfilled, (state, _) => {
        state.error = false;
        state.loading = false;
      });
  }
});

export const appReducer = appSlice.reducer;
export const { toggleMobileSidebar } = appSlice.actions;

export const selectAppLoading = (state: RootState) => state.app.loading;
export const selectAppError = (state: RootState) => state.app.error;
export const selectShowMobilesidebar = (state: RootState) =>
  state.app.mobileSidebar;
