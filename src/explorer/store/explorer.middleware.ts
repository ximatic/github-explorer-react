import { Middleware } from '@reduxjs/toolkit';

import { ApolloQueryResult, gql } from '@apollo/client';

import { apolloClient } from '../../ApolloProvider';

import { GraphqlPageInfo, GraphqlRepositoriesData, GraphqlRepositoriesNode } from '../models/explorer-graphql.model';
import { ExplorerPageInfo, Repository } from '../models/explorer.model';

import { ExplorerAction } from './explorer.actions';
import { loadRepositoriesError, loadRepositoriesSuccess, pageInfo, verifyTokenError, verifyTokenSuccess } from './explorer.slice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const explorerMiddleware: Middleware = (storeAPI: any) => (next: any) => (action: any) => {
  const result = next(action);

  const storageKey = 'gh-explorer-token';

  // token

  function storeToken(token: string): void {
    localStorage.setItem(storageKey, JSON.stringify(token));
  }

  function resetToken(): void {
    localStorage.removeItem(storageKey);
  }

  // page info

  function createPageInfo(itemsPerPage: number, pageInfo: GraphqlPageInfo): ExplorerPageInfo {
    return {
      itemsPerPage,
      cursorStart: pageInfo.startCursor,
      cursorEnd: pageInfo.endCursor,
      hasNextPage: pageInfo.hasNextPage,
      hasPreviousPage: pageInfo.hasPreviousPage,
    };
  }

  switch (action.type) {
    case ExplorerAction.Reset:
      resetToken();
      break;
    case ExplorerAction.VerifyToken:
      try {
        const token = action.payload.token;
        fetch('https://api.github.com/octocat', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(async (data: Response) => {
            if (!data.ok) {
              storeAPI.dispatch(verifyTokenError());
              return;
            }
            if (action.payload.storeToken) {
              storeToken(token);
            }
            storeAPI.dispatch(verifyTokenSuccess({ token }));
          })
          .catch(() => {
            storeAPI.dispatch(verifyTokenError());
          });
      } catch {
        storeAPI.dispatch(verifyTokenError());
      }
      break;
    case ExplorerAction.LoadRepositories:
      try {
        const pagination = action.payload.pagination;
        const token = storeAPI.getState().explorer.token;

        apolloClient
          .query({
            query: gql`
                query {
                  search(query: "is:public sort:stars-desc", type: REPOSITORY, ${pagination.itemsKey}: ${pagination.itemsValue}, ${pagination.cursorKey}: ${pagination.cursorValue}) {
                    nodes {
                      ...repositoryFragment
                    }
                    pageInfo {
                      endCursor
                      startCursor
                      hasNextPage
                      hasPreviousPage
                    }
                  }
                }
                fragment repositoryFragment on Repository {
                  name
                  createdAt
                  owner {
                    login
                  }
                  description
                  stargazerCount
                }
              `,
            context: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          })
          .then((result: ApolloQueryResult<GraphqlRepositoriesData>) => {
            const repositories = result.data.search.nodes.map((node: GraphqlRepositoriesNode) => {
              return {
                name: node.name,
                owner: node.owner?.login || 'N/A',
                stars: node.stargazerCount,
                createdAt: node.createdAt,
                description: node.description,
              } as Repository;
            });

            storeAPI.dispatch(loadRepositoriesSuccess({ repositories }));
            storeAPI.dispatch(pageInfo({ pageInfo: createPageInfo(pagination.itemsValue, result.data.search.pageInfo) }));
          });
      } catch {
        storeAPI.dispatch(loadRepositoriesError());
      }
      break;
  }

  return result;
};
