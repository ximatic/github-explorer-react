import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import * as router from 'react-router-dom';

import { PrimeReactProvider } from 'primereact/api';

import StoreProvider from '../../../src/store/StoreProvider.tsx';
import * as reactRedux from '../../../src/store/hooks';

import { reset } from '../../../src/explorer/store/explorer.slice';

import { MOCK_TOKEN_1 } from '../../../__mocks__/explorer.mocks.ts';

import Header from '../../../src/explorer/components/header.component.tsx';

jest.mock('../../../src/store/hooks');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockUseAppDispatch = reactRedux.useAppDispatch as unknown as jest.Mock;
const mockUseAppSelector = reactRedux.useAppSelector as unknown as jest.Mock;
const mockUseNavigate = router.useNavigate as jest.Mock;

describe('Header', () => {
  let dispatchMock: jest.Mock;
  let navigateMock: jest.Mock;

  const renderComponent = () =>
    render(
      <StoreProvider>
        <BrowserRouter>
          <PrimeReactProvider>
            <Header />
          </PrimeReactProvider>
        </BrowserRouter>
      </StoreProvider>,
    );

  beforeEach(() => {
    dispatchMock = jest.fn();
    navigateMock = jest.fn();

    mockUseAppDispatch.mockReturnValue(dispatchMock);
    mockUseNavigate.mockReturnValue(navigateMock);
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

  test('renders with proper title', () => {
    renderComponent();

    expect(screen.getByText(/GitHub Explorer/i)).toBeInTheDocument();
  });

  test('calls reset and navigates to / when logout button is clicked', () => {
    mockUseAppSelector.mockReturnValue(MOCK_TOKEN_1);

    renderComponent();

    const logoutBtn = screen.getByTestId('button-logout');
    fireEvent.click(logoutBtn);

    expect(dispatchMock).toHaveBeenCalledWith(reset());
    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
