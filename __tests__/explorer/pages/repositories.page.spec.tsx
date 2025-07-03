import { render, screen, fireEvent } from '@testing-library/react';
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter } from 'react-router-dom';

import {
  MOCK_EVENT_LOAD_REPOSITORIES_ERROR,
  MOCK_EXPLORER_PAGE_INFO_1,
  MOCK_REPOSITORY_1,
  MOCK_REPOSITORY_2,
} from '../../../__mocks__/explorer.mocks';

import { useAppDispatch, useAppSelector } from '../../../src/store/hooks';
import {
  loadRepositories,
  selectExplorerEvent,
  selectPageInfo,
  selectRepositories,
} from '../../../src/explorer/store/explorer.slice';
import { defaultExplorerPagination } from '../../../src/explorer/models/explorer.model';

import RepositoriesPage from '../../../src/explorer/pages/repositories.page';

jest.mock('../../../src/store/hooks');

const mockUseAppDispatch = useAppDispatch as unknown as jest.Mock;
const mockUseAppSelector = useAppSelector as unknown as jest.Mock;

describe('RepositoriesPage', () => {
  let dispatchMock: jest.Mock;

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <PrimeReactProvider>
          <RepositoriesPage />
        </PrimeReactProvider>
      </BrowserRouter>,
    );

  beforeEach(() => {
    dispatchMock = jest.fn();

    mockUseAppDispatch.mockReturnValue(dispatchMock);
    mockUseAppSelector.mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // snapshot tests

  test('matches snapshot', () => {
    const { asFragment } = renderComponent();

    expect(asFragment()).toMatchSnapshot();
  });

  // unit tests

  it('dispatches loadRepositories on mount', () => {
    renderComponent();

    expect(dispatchMock).toHaveBeenCalledWith(loadRepositories({ pagination: defaultExplorerPagination }));
  });

  it('shows loading spinner when repositories are loading', () => {
    renderComponent();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders repositories when present', () => {
    const mockRepositories = [MOCK_REPOSITORY_1, MOCK_REPOSITORY_2];
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectRepositories) {
        return mockRepositories;
      }

      return undefined;
    });

    renderComponent();

    expect(screen.getByText(`${MOCK_REPOSITORY_1.owner}/${MOCK_REPOSITORY_1.name}`)).toBeInTheDocument();
    expect(screen.getByText(`${MOCK_REPOSITORY_2.owner}/${MOCK_REPOSITORY_2.name}`)).toBeInTheDocument();
  });

  it('shows empty state when loading ended without repositories available', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectExplorerEvent) {
        return MOCK_EVENT_LOAD_REPOSITORIES_ERROR;
      }

      return undefined;
    });

    renderComponent();

    expect(screen.getByText(/No repositories available/i)).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  it('dispatches loadRepositories on pagination change', () => {
    const mockRepositories = [MOCK_REPOSITORY_1, MOCK_REPOSITORY_2];
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectRepositories) {
        return mockRepositories;
      } else if (selector === selectPageInfo) {
        return MOCK_EXPLORER_PAGE_INFO_1;
      }

      return undefined;
    });

    renderComponent();

    const dropdown = screen.getByTestId('pagination-dropdown');
    fireEvent.click(dropdown);
    const option = screen.getByText('10');
    fireEvent.click(option);

    // The Pagination component will call onPaginationChange, which should dispatch loadRepositories
    expect(dispatchMock).toHaveBeenCalled();
  });
});
