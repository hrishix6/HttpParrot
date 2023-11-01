import { createSlice } from '@reduxjs/toolkit';
import { initAppDataAsync } from './app.async.actions';
import { RootState } from '@/common/store';

interface AppState {
  loading: boolean;
  error: boolean;
}

const initialState: AppState = {
  loading: true,
  error: false
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
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

export const selectAppLoading = (state: RootState) => state.app.loading;
export const selectAppError = (state: RootState) => state.app.error;
