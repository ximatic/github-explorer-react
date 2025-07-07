/* eslint-disable @typescript-eslint/no-explicit-any */
import { apolloClient } from '../../../src/ApolloProvider';

import { MOCK_TOKEN_1 } from '../../../__mocks__/explorer.mocks';

import { ExplorerAction } from '../../../src/explorer/store/explorer.actions';
import {
  loadRepositoriesSuccess,
  loadRepositoriesError,
  loadRepositorySuccess,
  loadRepositoryError,
  pageInfo,
  verifyTokenSuccess,
  verifyTokenError,
} from '../../../src/explorer/store/explorer.slice';

import { explorerMiddleware } from '../../../src/explorer/store/explorer.middleware';

jest.mock('../../../src/ApolloProvider', () => ({
  apolloClient: {
    query: jest.fn(),
  },
}));

describe('explorerMiddleware', () => {
  let storeAPI: any;
  let next: jest.Mock;
  let action: any;

  beforeEach(() => {
    storeAPI = {
      dispatch: jest.fn(),
      getState: jest.fn(() => ({
        explorer: { token: MOCK_TOKEN_1 },
      })),
    };
    next = jest.fn();

    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('handles ExplorerAction.Reset', () => {
    localStorage.setItem('gh-explorer-token', `'${MOCK_TOKEN_1}'`);
    action = { type: ExplorerAction.Reset };

    explorerMiddleware(storeAPI)(next)(action);

    expect(localStorage.getItem('gh-explorer-token')).toBeNull();
  });

  describe('ExplorerAction.VerifyToken', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('dispatches verifyTokenSuccess and stores token on success', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
      } as unknown as Response);
      action = { type: ExplorerAction.VerifyToken, payload: { token: MOCK_TOKEN_1, storeToken: true } };

      await explorerMiddleware(storeAPI)(next)(action);
      // Wait for promise chain
      await Promise.resolve();

      expect(localStorage.getItem('gh-explorer-token')).toBe(JSON.stringify(MOCK_TOKEN_1));
      expect(storeAPI.dispatch).toHaveBeenCalledWith(verifyTokenSuccess({ token: MOCK_TOKEN_1 }));
    });

    it('dispatches verifyTokenError on non-ok response', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
      } as unknown as Response);
      action = { type: ExplorerAction.VerifyToken, payload: { token: MOCK_TOKEN_1, storeToken: false } };

      await explorerMiddleware(storeAPI)(next)(action);
      await Promise.resolve();

      expect(storeAPI.dispatch).toHaveBeenCalledWith(verifyTokenError());
    });

    it('dispatches verifyTokenError on fetch error', async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        throw new Error('fail');
      });
      action = { type: ExplorerAction.VerifyToken, payload: { token: MOCK_TOKEN_1, storeToken: false } };

      await explorerMiddleware(storeAPI)(next)(action);
      await Promise.resolve();

      expect(storeAPI.dispatch).toHaveBeenCalledWith(verifyTokenError());
    });
  });

  describe('ExplorerAction.LoadRepositories', () => {
    it('dispatches loadRepositoriesSuccess and pageInfo on success', async () => {
      const mockNodes = [{ name: 'repo1', owner: { login: 'user1' }, stargazerCount: 1, createdAt: '2020', description: 'desc' }];
      const mockPageInfo = { startCursor: 'a', endCursor: 'b', hasNextPage: true, hasPreviousPage: false };
      jest.spyOn(apolloClient, 'query').mockResolvedValue({
        data: {
          search: {
            nodes: mockNodes,
            pageInfo: mockPageInfo,
          },
        },
        loading: false,
        networkStatus: 7,
        errors: undefined,
      });
      action = {
        type: ExplorerAction.LoadRepositories,
        payload: { pagination: { itemsKey: 'first', itemsValue: 10, cursorKey: 'after', cursorValue: null } },
      };

      await explorerMiddleware(storeAPI)(next)(action);
      await Promise.resolve();

      expect(storeAPI.dispatch).toHaveBeenCalledWith(
        loadRepositoriesSuccess({
          repositories: [
            {
              name: 'repo1',
              owner: 'user1',
              stars: 1,
              createdAt: '2020',
              description: 'desc',
            },
          ],
        }),
      );
      expect(storeAPI.dispatch).toHaveBeenCalledWith(
        pageInfo({
          pageInfo: {
            itemsPerPage: 10,
            cursorStart: 'a',
            cursorEnd: 'b',
            hasNextPage: true,
            hasPreviousPage: false,
          },
        }),
      );
    });

    it('dispatches loadRepositoriesError on error', async () => {
      jest.spyOn(apolloClient, 'query').mockImplementation(() => {
        throw new Error('fail');
      });
      action = {
        type: ExplorerAction.LoadRepositories,
        payload: { pagination: { itemsKey: 'first', itemsValue: 10, cursorKey: 'after', cursorValue: null } },
      };

      await explorerMiddleware(storeAPI)(next)(action);
      await Promise.resolve();

      expect(storeAPI.dispatch).toHaveBeenCalledWith(loadRepositoriesError());
    });
  });

  describe('ExplorerAction.LoadRepository', () => {
    it('dispatches loadRepositorySuccess and pageInfo on success', async () => {
      const mockIssues = [{ title: 'issue1', author: { login: 'bob' }, url: 'url1', createdAt: '2021' }];
      const mockPageInfo = { startCursor: 'a', endCursor: 'b', hasNextPage: true, hasPreviousPage: false };
      jest.spyOn(apolloClient, 'query').mockResolvedValue({
        data: {
          repository: {
            stargazerCount: 2,
            description: 'desc',
            createdAt: '2020',
            url: 'repo-url',
            issues: {
              nodes: mockIssues,
              pageInfo: mockPageInfo,
            },
          },
        },
        loading: false,
        networkStatus: 7,
        errors: undefined,
      });
      action = {
        type: ExplorerAction.LoadRepository,
        payload: {
          owner: 'user1',
          name: 'repo1',
          pagination: { itemsKey: 'first', itemsValue: 5, cursorKey: 'after', cursorValue: null },
        },
      };

      await explorerMiddleware(storeAPI)(next)(action);
      await Promise.resolve();

      expect(storeAPI.dispatch).toHaveBeenCalledWith(
        loadRepositorySuccess({
          repository: {
            name: 'repo1',
            owner: 'user1',
            stars: 2,
            createdAt: '2020',
            description: 'desc',
            url: 'repo-url',
            issues: [
              {
                title: 'issue1',
                author: 'bob',
                url: 'url1',
                createdAt: '2021',
              },
            ],
          },
        }),
      );
      expect(storeAPI.dispatch).toHaveBeenCalledWith(
        pageInfo({
          pageInfo: {
            itemsPerPage: 5,
            cursorStart: 'a',
            cursorEnd: 'b',
            hasNextPage: true,
            hasPreviousPage: false,
          },
        }),
      );
    });

    it('dispatches loadRepositoryError on error', async () => {
      jest.spyOn(apolloClient, 'query').mockImplementation(() => {
        throw new Error('fail');
      });
      action = {
        type: ExplorerAction.LoadRepository,
        payload: {
          owner: 'user1',
          name: 'repo1',
          pagination: { itemsKey: 'first', itemsValue: 5, cursorKey: 'after', cursorValue: null },
        },
      };

      await explorerMiddleware(storeAPI)(next)(action);
      await Promise.resolve();

      expect(storeAPI.dispatch).toHaveBeenCalledWith(loadRepositoryError());
    });
  });
});
