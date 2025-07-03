import { render, screen, fireEvent } from '@testing-library/react';

import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';

import { PrimeReactProvider } from 'primereact/api';

import {
  MOCK_EVENT_LOAD_REPOSITORY_ERROR,
  MOCK_EXPLORER_PAGE_INFO_1,
  MOCK_REPOSITORY_1,
  MOCK_REPOSITORY_ISSUE_1,
  MOCK_REPOSITORY_ISSUE_2,
} from '../../../__mocks__/explorer.mocks';

import { useAppDispatch, useAppSelector } from '../../../src/store/hooks';
import {
  loadRepository,
  selectExplorerEvent,
  selectPageInfo,
  selectRepository,
} from '../../../src/explorer/store/explorer.slice';
import { defaultExplorerPagination } from '../../../src/explorer/models/explorer.model';

import RepositoryPage from '../../../src/explorer/pages/repository.page';

jest.mock('../../../src/store/hooks');

const mockUseAppDispatch = useAppDispatch as unknown as jest.Mock;
const mockUseAppSelector = useAppSelector as unknown as jest.Mock;

describe('RepositoryPage', () => {
  let dispatchMock: jest.Mock;

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <PrimeReactProvider>
          <RepositoryPage />
        </PrimeReactProvider>
      </BrowserRouter>,
    );

  const renderComponentWithRoute = (route: string) =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <PrimeReactProvider>
          <Routes>
            <Route path='/:owner/:name' element={<RepositoryPage />} />
          </Routes>
        </PrimeReactProvider>
      </MemoryRouter>,
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

  it('deos not dispatch loadRepository on mount without route params', () => {
    renderComponent();

    expect(dispatchMock).toHaveBeenCalledTimes(0);
  });

  it('dispatches loadRepository on mount', () => {
    renderComponentWithRoute(`/${MOCK_REPOSITORY_1.owner}/${MOCK_REPOSITORY_1.name}`);

    expect(dispatchMock).toHaveBeenCalledWith(
      loadRepository({
        owner: MOCK_REPOSITORY_1.owner,
        name: MOCK_REPOSITORY_1.name,
        pagination: defaultExplorerPagination,
      }),
    );
  });

  it('shows loading spinner when loading and no repository', () => {
    renderComponent();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders repository info and issues when repository is present', () => {
    const mockRepo = {
      ...MOCK_REPOSITORY_1,
      issues: [MOCK_REPOSITORY_ISSUE_1, MOCK_REPOSITORY_ISSUE_2],
    };
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectRepository) {
        return mockRepo;
      }

      return undefined;
    });

    renderComponent();

    expect(screen.getByText(MOCK_REPOSITORY_ISSUE_1.title)).toBeInTheDocument();
    expect(screen.getByText(MOCK_REPOSITORY_ISSUE_2.title)).toBeInTheDocument();
    expect(screen.getByText(/Repositories/)).toBeInTheDocument();
  });

  it('renders empty state when not loading and no repository', () => {
    // Simulate explorerEvent error to set loading to false
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectExplorerEvent) {
        return MOCK_EVENT_LOAD_REPOSITORY_ERROR;
      }

      return undefined;
    });

    renderComponent();

    expect(screen.getByText(/No repository available/i)).toBeInTheDocument();
    expect(screen.getByText(/Please refresh page or try again later/i)).toBeInTheDocument();
    expect(screen.getByText(/Repositories/)).toBeInTheDocument();
  });

  it('dispatches loadRepository on pagination change', () => {
    const mockRepo = {
      ...MOCK_REPOSITORY_1,
      issues: [MOCK_REPOSITORY_ISSUE_1, MOCK_REPOSITORY_ISSUE_2],
    };
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === selectRepository) {
        return mockRepo;
      } else if (selector === selectPageInfo) {
        return MOCK_EXPLORER_PAGE_INFO_1;
      }

      return undefined;
    });

    renderComponentWithRoute(`/${MOCK_REPOSITORY_1.owner}/${MOCK_REPOSITORY_1.name}`);

    const dropdown = screen.getByTestId('pagination-dropdown');
    fireEvent.click(dropdown);
    const option = screen.getByText('10');
    fireEvent.click(option);

    expect(dispatchMock).toHaveBeenCalled();
  });
});
