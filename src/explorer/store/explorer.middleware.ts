import { Middleware } from '@reduxjs/toolkit';

import { ExplorerAction } from './explorer.actions';
import { verifyTokenError, verifyTokenSuccess } from './explorer.slice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const explorerMiddleware: Middleware = (storeAPI: any) => (next: any) => (action: any) => {
  const result = next(action);

  const storageKey = 'gh-explorer-token';

  function storeToken(token: string): void {
    localStorage.setItem(storageKey, JSON.stringify(token));
  }

  function resetToken(): void {
    localStorage.removeItem(storageKey);
  }

  switch (action.type) {
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
    case ExplorerAction.Reset:
      resetToken();
      break;
  }

  return result;
};
