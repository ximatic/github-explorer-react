// common

export interface GraphqlPageInfo {
  startCursor: string;
  endCursor: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// repositories

export interface GraphqlRepositoriesNodeOwner {
  login: string;
}

export interface GraphqlRepositoriesNode {
  name: string;
  owner: GraphqlRepositoriesNodeOwner;
  description: string;
  createdAt: Date | string;
  stargazerCount: number;
}

export interface GraphqlRepositoriesSearch {
  pageInfo: GraphqlPageInfo;
  nodes: GraphqlRepositoriesNode[];
}

export interface GraphqlRepositoriesData {
  search: GraphqlRepositoriesSearch;
}

// repository

export interface GraphqlRepositoryIssueAuthor {
  login: string;
}

export interface GraphqlRepositoryIssue {
  title: string;
  createdAt: Date | string;
  author: GraphqlRepositoryIssueAuthor;
  url: string;
}

export interface GraphqlRepositoryIssues {
  pageInfo: GraphqlPageInfo;
  nodes: GraphqlRepositoryIssue[];
}

export interface GraphqlRepository {
  description: string;
  createdAt: Date | string;
  stargazerCount: number;
  url: string;
  issues: GraphqlRepositoryIssues;
}

export interface GraphqlRepositoryData {
  repository: GraphqlRepository;
}
