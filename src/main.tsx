import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

import { PrimeReactProvider } from 'primereact/api';

import StoreProvider from './store/StoreProvider.tsx';
import ApolloGraphqlProvider from './ApolloProvider.tsx';

import App from './App.tsx';

import './index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <ApolloGraphqlProvider>
        <BrowserRouter>
          <PrimeReactProvider>
            <App />
          </PrimeReactProvider>
        </BrowserRouter>
      </ApolloGraphqlProvider>
    </StoreProvider>
  </StrictMode>,
);
