import { configureStore } from '@reduxjs/toolkit';

import { explorerSlice } from '../explorer/store/explorer.slice';
import { explorerMiddleware } from '../explorer/store/explorer.middleware';

// export const store = configureStore({
//   reducer: {
//     explorer: explorerSlice.reducer,
//   },
//   middleware: (getDefaultMiddleware) => {
//     return getDefaultMiddleware().concat(explorerMiddleware);
//   },
// });

// export type AppStore = typeof store;
// export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;

export const makeStore = () => {
  return configureStore({
    reducer: {
      explorer: explorerSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(explorerMiddleware);
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
