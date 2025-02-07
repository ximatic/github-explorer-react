import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';

import StoreProvider from '../../../src/store/StoreProvider.tsx';

import { MOCK_REPOSITORY_1, MOCK_REPOSITORY_2 } from '../../../__mocks__/explorer.mocks.ts';

import RepositoryInfo from '../../../src/explorer/components/repository-info.component.tsx';

describe('Header', () => {
  test('renders repository panel with repository URL', async () => {
    const { queryAllByText } = render(
      <StoreProvider>
        <BrowserRouter>
          <PrimeReactProvider>
            <RepositoryInfo repository={MOCK_REPOSITORY_1} />
          </PrimeReactProvider>
        </BrowserRouter>
      </StoreProvider>,
    );
    expect(queryAllByText(new RegExp(`\\b(${MOCK_REPOSITORY_1.owner}/${MOCK_REPOSITORY_1.name})\\b`))).toBeTruthy();
    expect(queryAllByText(/Repository URL/i)).toBeTruthy();
  });
  test('renders repository panel without repository URL', async () => {
    const { queryAllByText } = render(
      <StoreProvider>
        <BrowserRouter>
          <PrimeReactProvider>
            <RepositoryInfo repository={MOCK_REPOSITORY_2} />
          </PrimeReactProvider>
        </BrowserRouter>
      </StoreProvider>,
    );
    expect(queryAllByText(new RegExp(`\\b(${MOCK_REPOSITORY_2.owner}/${MOCK_REPOSITORY_2.name})\\b`))).toBeTruthy();
    expect(queryAllByText(/Repository URL/i)).toEqual([]);
  });
});
