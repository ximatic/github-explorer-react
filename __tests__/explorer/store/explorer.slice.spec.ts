import {
  MOCK_EVENT_LOAD_REPOSITORIES_PROCESSING,
  MOCK_EXPLORER_PAGE_INFO_1,
  MOCK_EXPLORER_PAGE_INFO_2,
  MOCK_EXPLORER_PAGINATION_1,
  MOCK_REPOSITORY_1,
  MOCK_REPOSITORY_2,
  MOCK_TOKEN_1,
} from '../../../__mocks__/explorer.mocks';

import { ExplorerEventName, ExplorerEventType, ExplorerState } from '../../../src/explorer/store/explorer.state';

import {
  explorerSlice,
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
  selectExplorerEvent,
  selectToken,
  selectRepositories,
  selectRepository,
  selectPageInfo,
} from '../../../src/explorer/store/explorer.slice';

describe('explorerSlice', () => {
  describe('reducers', () => {
    let initialState: ReturnType<typeof explorerSlice.getInitialState>;

    beforeEach(() => {
      initialState = explorerSlice.getInitialState();
    });

    // reset

    it('reset sets state to initial', () => {
      const prevState = { ...initialState, token: MOCK_TOKEN_1 };
      const state = explorerSlice.reducer(prevState, reset());

      expect(state).toEqual(initialState);
    });

    // verify token

    it('verifyToken sets event and resets relevant state', () => {
      const prevState = { ...initialState };
      const state = explorerSlice.reducer(prevState, verifyToken({ token: MOCK_TOKEN_1, storeToken: true }));

      expect(state.token).toBeNull();
      expect(state.event).toEqual({
        name: ExplorerEventName.VerifyToken,
        type: ExplorerEventType.Processing,
      });
    });

    it('verifyTokenSuccess sets token and event', () => {
      const state = explorerSlice.reducer(initialState, verifyTokenSuccess({ token: MOCK_TOKEN_1 }));

      expect(state.token).toBe(MOCK_TOKEN_1);
      expect(state.event).toEqual({
        name: ExplorerEventName.VerifyToken,
        type: ExplorerEventType.Success,
      });
    });

    it('verifyTokenError resets token and sets event', () => {
      const prevState = { ...initialState, token: MOCK_TOKEN_1 };
      const state = explorerSlice.reducer(prevState, verifyTokenError());

      expect(state.token).toBeNull();
      expect(state.event).toEqual({
        name: ExplorerEventName.VerifyToken,
        type: ExplorerEventType.Error,
      });
    });

    // load repositories

    it('loadRepositories sets event and resets repository/pageInfo', () => {
      const prevState = { ...initialState, repository: MOCK_REPOSITORY_1, pageInfo: MOCK_EXPLORER_PAGE_INFO_1 };
      const state = explorerSlice.reducer(prevState, loadRepositories({ pagination: MOCK_EXPLORER_PAGINATION_1 }));

      expect(state.repository).toBeNull();
      expect(state.pageInfo).toBeNull();
      expect(state.event).toEqual({
        name: ExplorerEventName.LoadRepositories,
        type: ExplorerEventType.Processing,
      });
    });

    it('loadRepositoriesSuccess sets repositories and event', () => {
      const prevState = { ...initialState, repository: MOCK_REPOSITORY_1, pageInfo: MOCK_EXPLORER_PAGE_INFO_1 };
      const state = explorerSlice.reducer(prevState, loadRepositoriesSuccess({ repositories: [MOCK_REPOSITORY_1] }));

      expect(state.repository).toBeNull();
      expect(state.repositories).toEqual([MOCK_REPOSITORY_1]);
      expect(state.event).toEqual({
        name: ExplorerEventName.LoadRepositories,
        type: ExplorerEventType.Success,
      });
    });

    it('loadRepositoriesError resets repositories and sets event', () => {
      const prevState = {
        ...initialState,
        repositories: [MOCK_REPOSITORY_1],
        repository: MOCK_REPOSITORY_1,
        pageInfo: MOCK_EXPLORER_PAGE_INFO_1,
      };
      const state = explorerSlice.reducer(prevState, loadRepositoriesError());

      expect(state.repositories).toBeNull();
      expect(state.repository).toBeNull();
      expect(state.pageInfo).toBeNull();
      expect(state.event).toEqual({
        name: ExplorerEventName.LoadRepositories,
        type: ExplorerEventType.Error,
      });
    });

    // load repository

    it('loadRepository sets event and resets pageInfo', () => {
      const prevState = { ...initialState, pageInfo: MOCK_EXPLORER_PAGE_INFO_1 };
      const state = explorerSlice.reducer(
        prevState,
        loadRepository({ owner: MOCK_REPOSITORY_1.owner, name: MOCK_REPOSITORY_1.name, pagination: MOCK_EXPLORER_PAGINATION_1 }),
      );

      expect(state.pageInfo).toBeNull();
      expect(state.event).toEqual({
        name: ExplorerEventName.LoadRepository,
        type: ExplorerEventType.Processing,
      });
    });

    it('loadRepositorySuccess sets repository and event', () => {
      const state = explorerSlice.reducer(initialState, loadRepositorySuccess({ repository: MOCK_REPOSITORY_1 }));

      expect(state.repository).toBe(MOCK_REPOSITORY_1);
      expect(state.event).toEqual({
        name: ExplorerEventName.LoadRepository,
        type: ExplorerEventType.Success,
      });
    });

    it('loadRepositoryError resets repository/pageInfo and sets event', () => {
      const prevState = { ...initialState, repository: MOCK_REPOSITORY_1, pageInfo: MOCK_EXPLORER_PAGE_INFO_1 };
      const state = explorerSlice.reducer(prevState, loadRepositoryError());

      expect(state.repository).toBeNull();
      expect(state.pageInfo).toBeNull();
      expect(state.event).toEqual({
        name: ExplorerEventName.LoadRepository,
        type: ExplorerEventType.Error,
      });
    });

    // page info

    it('pageInfo sets pageInfo', () => {
      const prevState = { ...initialState, pageInfo: MOCK_EXPLORER_PAGE_INFO_1 };
      const state = explorerSlice.reducer(prevState, pageInfo({ pageInfo: MOCK_EXPLORER_PAGE_INFO_2 }));

      expect(state.pageInfo).toBe(MOCK_EXPLORER_PAGE_INFO_2);
    });
  });

  describe('selectors', () => {
    const state: ExplorerState = {
      token: MOCK_TOKEN_1,
      repositories: [MOCK_REPOSITORY_1, MOCK_REPOSITORY_2],
      repository: MOCK_REPOSITORY_1,
      pageInfo: MOCK_EXPLORER_PAGE_INFO_1,
      event: MOCK_EVENT_LOAD_REPOSITORIES_PROCESSING,
      error: null,
    };

    it('selectExplorerEvent returns event', () => {
      expect(selectExplorerEvent({ explorer: state })).toBe(state.event);
    });

    it('selectToken returns token', () => {
      expect(selectToken({ explorer: state })).toBe(state.token);
    });

    it('selectRepositories returns repositories', () => {
      expect(selectRepositories({ explorer: state })).toBe(state.repositories);
    });

    it('selectRepository returns repository', () => {
      expect(selectRepository({ explorer: state })).toBe(state.repository);
    });

    it('selectPageInfo returns pageInfo', () => {
      expect(selectPageInfo({ explorer: state })).toBe(state.pageInfo);
    });
  });
});
