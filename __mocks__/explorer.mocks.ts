import { ExplorerPaginationItemsKey, ExplorerPaginationCursorKey } from '../src/explorer/models/explorer.model';

// common mocks

export const MOCK_TOKEN_1 = 'test-token-1';

export const MOCK_REPOSITORY_OWNER_1 = 'test-owner-1';
export const MOCK_REPOSITORY_OWNER_2 = 'test-owner-2';

export const MOCK_REPOSITORY_NAME_1 = 'test-name-1';
export const MOCK_REPOSITORY_NAME_2 = 'test-name-2';

// repository mocks

export const MOCK_REPOSITORY_1 = {
  owner: MOCK_REPOSITORY_OWNER_1,
  name: MOCK_REPOSITORY_NAME_1,
  stars: 0,
  createdAt: new Date().toDateString(),
  description: 'test-description-1',
  url: 'test-url-1',
  issues: [],
};

export const MOCK_REPOSITORY_2 = {
  owner: MOCK_REPOSITORY_OWNER_2,
  name: MOCK_REPOSITORY_NAME_2,
  stars: 0,
  createdAt: new Date().toDateString(),
  description: 'test-description-2',
  issues: [],
};

// pagination mocks

export const MOCK_EXPLORER_PAGINATION_1 = {
  itemsKey: ExplorerPaginationItemsKey.First,
  itemsValue: 5,
  cursorKey: ExplorerPaginationCursorKey.After,
  cursorValue: null,
};

export const MOCK_EXPLORER_PAGE_INFO_1 = {
  itemsPerPage: 5,
  cursorStart: null,
  cursorEnd: null,
  hasNextPage: false,
  hasPreviousPage: false,
};

// store mocks

export const MOCK_INITIAL_EXPLORER_STATE = {
  token: null,
  repositories: null,
  repository: null,
  pageInfo: null,
  error: null,
};
