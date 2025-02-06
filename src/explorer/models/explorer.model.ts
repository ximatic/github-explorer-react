export interface RepositoryIssue {
  title: string;
  author: string;
  createdAt: Date;
  url: string;
}

export interface Repository {
  name: string;
  owner: string;
  stars: number;
  createdAt: Date;
  description?: string;
  url?: string;
  issues?: RepositoryIssue[];
}

// responses

export interface ExplorerPageInfo {
  itemsPerPage: number;
  cursorStart: string | null;
  cursorEnd: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ExplorerDataResponse {
  pageInfo: ExplorerPageInfo;
}

export type RepositoriesResponse = ExplorerDataResponse & {
  repositories: Repository[];
};

export type RepositoryResponse = ExplorerDataResponse & {
  repository: Repository;
};

// pagination

export enum ExplorerPaginationItemsKey {
  First = 'first',
  Last = 'last',
}

export enum ExplorerPaginationCursorKey {
  After = 'after',
  Before = 'before',
}

export interface ExplorerPagination {
  itemsKey: ExplorerPaginationItemsKey;
  itemsValue: number;
  cursorKey: ExplorerPaginationCursorKey;
  cursorValue: string | null;
}

export const defaultExplorerPagination: ExplorerPagination = {
  itemsKey: ExplorerPaginationItemsKey.First,
  itemsValue: 5,
  cursorKey: ExplorerPaginationCursorKey.After,
  cursorValue: null,
};
