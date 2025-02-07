import { createSlice, ReducerCreators, type PayloadAction } from '@reduxjs/toolkit';

import { ExplorerEvent, ExplorerEventName, ExplorerEventType, ExplorerState } from './explorer.state';
import { ExplorerPageInfo, ExplorerPagination, Repository } from '../models/explorer.model';

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
      state.pageInfo = initialState.pageInfo;
      state.event = {
        name: ExplorerEventName.VerifyToken,
        type: ExplorerEventType.Processing,
      };
    }),
    verifyTokenSuccess: create.reducer((state: ExplorerState, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.repositories = initialState.repositories;
      state.repository = initialState.repository;
      state.pageInfo = initialState.pageInfo;
      state.event = {
        name: ExplorerEventName.VerifyToken,
        type: ExplorerEventType.Success,
      };
    }),
    verifyTokenError: create.reducer((state: ExplorerState) => {
      state.token = initialState.token;
      state.repositories = initialState.repositories;
      state.repository = initialState.repository;
      state.pageInfo = initialState.pageInfo;
      state.event = {
        name: ExplorerEventName.VerifyToken,
        type: ExplorerEventType.Error,
      };
    }),
    // load repositories
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadRepositories: create.reducer((state: ExplorerState, action: PayloadAction<{ pagination: ExplorerPagination }>) => {
      state.repository = initialState.repository;
      state.pageInfo = initialState.pageInfo;
      state.event = {
        name: ExplorerEventName.LoadRepositories,
        type: ExplorerEventType.Processing,
      };
    }),
    loadRepositoriesSuccess: create.reducer((state: ExplorerState, action: PayloadAction<{ repositories: Repository[] }>) => {
      state.repositories = action.payload.repositories;
      state.repository = initialState.repository;
      state.event = {
        name: ExplorerEventName.LoadRepositories,
        type: ExplorerEventType.Success,
      };
    }),
    loadRepositoriesError: create.reducer((state: ExplorerState) => {
      state.repositories = initialState.repositories;
      state.repository = initialState.repository;
      state.pageInfo = initialState.pageInfo;
      state.event = {
        name: ExplorerEventName.LoadRepositories,
        type: ExplorerEventType.Error,
      };
    }),
    // load repository
    loadRepository: create.reducer(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (state: ExplorerState, action: PayloadAction<{ owner: string; name: string; pagination: ExplorerPagination }>) => {
        state.pageInfo = initialState.pageInfo;
        state.event = {
          name: ExplorerEventName.LoadRepository,
          type: ExplorerEventType.Processing,
        };
      },
    ),
    loadRepositorySuccess: create.reducer((state: ExplorerState, action: PayloadAction<{ repository: Repository }>) => {
      state.repository = action.payload.repository;
      state.event = {
        name: ExplorerEventName.LoadRepository,
        type: ExplorerEventType.Success,
      };
    }),
    loadRepositoryError: create.reducer((state: ExplorerState) => {
      state.repository = initialState.repository;
      state.pageInfo = initialState.pageInfo;
      state.event = {
        name: ExplorerEventName.LoadRepository,
        type: ExplorerEventType.Error,
      };
    }),
    // pagination
    pageInfo: create.reducer((state: ExplorerState, action: PayloadAction<{ pageInfo: ExplorerPageInfo }>) => {
      state.pageInfo = action.payload.pageInfo;
    }),
  }),
  selectors: {
    selectExplorerEvent: (state: ExplorerState): ExplorerEvent | null => state.event,
    selectToken: (state: ExplorerState): string | null => state.token,
    selectRepositories: (state: ExplorerState): Repository[] | null => state.repositories,
    selectRepository: (state: ExplorerState): Repository | null => state.repository,
    selectPageInfo: (state: ExplorerState): ExplorerPageInfo | null => state.pageInfo,
  },
});

export const {
  reset,
  verifyToken,
  verifyTokenSuccess,
  verifyTokenError,
  loadRepositories,
  loadRepositoriesSuccess,
  loadRepositoriesError,
  loadRepository,
  loadRepositorySuccess,
  loadRepositoryError,
  pageInfo,
} = explorerSlice.actions;

export const { selectExplorerEvent, selectToken, selectRepositories, selectRepository, selectPageInfo } = explorerSlice.selectors;
