import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';

import StoreProvider from '../../../src/store/StoreProvider.tsx';

import Header from '../../../src/explorer/components/header.component.tsx';

describe('Header', () => {
  test('renders with proper title', async () => {
    const { queryAllByText } = render(
      <StoreProvider>
        <BrowserRouter>
          <PrimeReactProvider>
            <Header />
          </PrimeReactProvider>
        </BrowserRouter>
      </StoreProvider>,
    );
    expect(queryAllByText(/GitHub Explorer/i)).toBeTruthy();
  });
});
