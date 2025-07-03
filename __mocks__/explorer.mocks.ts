import { ExplorerPaginationItemsKey, ExplorerPaginationCursorKey, RepositoryIssue } from '../src/explorer/models/explorer.model';
import { ExplorerEvent, ExplorerEventName, ExplorerEventType } from '../src/explorer/store/explorer.state';

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
  createdAt: 'Thu Jul 01 2025',
  description: 'test-description-1',
  url: 'test-url-1',
  issues: [],
};

export const MOCK_REPOSITORY_2 = {
  owner: MOCK_REPOSITORY_OWNER_2,
  name: MOCK_REPOSITORY_NAME_2,
  stars: 0,
  createdAt: 'Thu Jul 01 2025',
  description: 'test-description-2',
  issues: [],
};

// repository issue mocks

export const MOCK_REPOSITORY_ISSUE_1: RepositoryIssue = {
  title: 'tests-issue-title-1',
  author: 'test-issue-author-1',
  createdAt: 'Thu Jul 01 2025',
  url: 'http://test-issue-url-1',
};

export const MOCK_REPOSITORY_ISSUE_2: RepositoryIssue = {
  title: 'tests-issue-title-2',
  author: 'test-issue-author-2',
  createdAt: 'Thu Jul 01 2025',
  url: 'http://test-issue-url-2',
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
  hasNextPage: true,
  hasPreviousPage: true,
  cursorStart: 'start-cursor',
  cursorEnd: 'end-cursor',
};

export const MOCK_EXPLORER_PAGE_INFO_2 = {
  itemsPerPage: 5,
  hasNextPage: false,
  hasPreviousPage: false,
  cursorStart: null,
  cursorEnd: null,
};

// store mocks

export const MOCK_INITIAL_EXPLORER_STATE = {
  token: null,
  repositories: null,
  repository: null,
  pageInfo: null,
  error: null,
};

// explorer events

export const MOCK_EVENT_VERIFY_TOKEN_PROCESSING: ExplorerEvent = {
  name: ExplorerEventName.VerifyToken,
  type: ExplorerEventType.Processing,
};

export const MOCK_EVENT_VERIFY_TOKEN_SUCCESS: ExplorerEvent = {
  name: ExplorerEventName.VerifyToken,
  type: ExplorerEventType.Success,
};

export const MOCK_EVENT_VERIFY_TOKEN_ERROR: ExplorerEvent = {
  name: ExplorerEventName.VerifyToken,
  type: ExplorerEventType.Error,
};

export const MOCK_EVENT_LOAD_REPOSITORIES_PROCESSING: ExplorerEvent = {
  name: ExplorerEventName.LoadRepositories,
  type: ExplorerEventType.Processing,
};

export const MOCK_EVENT_LOAD_REPOSITORIES_SUCCESS: ExplorerEvent = {
  name: ExplorerEventName.LoadRepositories,
  type: ExplorerEventType.Success,
};

export const MOCK_EVENT_LOAD_REPOSITORIES_ERROR: ExplorerEvent = {
  name: ExplorerEventName.LoadRepositories,
  type: ExplorerEventType.Error,
};

export const MOCK_EVENT_LOAD_REPOSITORY_PROCESSING: ExplorerEvent = {
  name: ExplorerEventName.LoadRepository,
  type: ExplorerEventType.Processing,
};

export const MOCK_EVENT_LOAD_REPOSITORY_SUCCESS: ExplorerEvent = {
  name: ExplorerEventName.LoadRepository,
  type: ExplorerEventType.Success,
};

export const MOCK_EVENT_LOAD_REPOSITORY_ERROR: ExplorerEvent = {
  name: ExplorerEventName.LoadRepository,
  type: ExplorerEventType.Error,
};
