import { createSlice, ReducerCreators, type PayloadAction } from '@reduxjs/toolkit';

import { ExplorerEvent, ExplorerEventName, ExplorerEventType, ExplorerState } from './explorer.state';

const initialState: ExplorerState = {
  token: null,
  repositories: null,
  repository: null,
  pageInfo: null,
  error: null,
  event: null,
};

export const explorerSlice = createSlice({
  name: 'explorer',
  initialState: initialState,
  reducers: (create: ReducerCreators<ExplorerState>) => ({
    // reset
    reset: create.reducer(() => initialState),
    // verify token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    verifyToken: create.reducer((state: ExplorerState, action: PayloadAction<{ token: string; storeToken: boolean }>) => {
      state.token = initialState.token;
      state.repositories = initialState.repositories;
      state.repository = initialState.repository;
      state.event = {
        name: ExplorerEventName.VerifyToken,
        type: ExplorerEventType.Processing,
      };
    }),
    verifyTokenSuccess: create.reducer((state: ExplorerState, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.repositories = initialState.repositories;
      state.repository = initialState.repository;
      state.event = {
        name: ExplorerEventName.VerifyToken,
        type: ExplorerEventType.Success,
      };
    }),
    verifyTokenError: create.reducer((state: ExplorerState) => {
      state.token = initialState.token;
      state.repositories = initialState.repositories;
      state.repository = initialState.repository;
      state.event = {
        name: ExplorerEventName.VerifyToken,
        type: ExplorerEventType.Error,
      };
    }),
  }),
  selectors: {
    selectToken: (state: ExplorerState): string | null => state.token,
    selectExplorerEvent: (state: ExplorerState): ExplorerEvent | null => state.event,
  },
});

export const { reset, verifyToken, verifyTokenSuccess, verifyTokenError } = explorerSlice.actions;

export const { selectToken, selectExplorerEvent } = explorerSlice.selectors;
