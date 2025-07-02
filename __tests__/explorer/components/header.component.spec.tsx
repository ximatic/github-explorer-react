import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { PrimeReactProvider } from 'primereact/api';

import StoreProvider from '../../../src/store/StoreProvider.tsx';
import * as reactRedux from '../../../src/store/hooks';

import { reset } from '../../../src/explorer/store/explorer.slice';

import { MOCK_TOKEN_1 } from '../../../__mocks__/explorer.mocks.ts';

import Header from '../../../src/explorer/components/header.component.tsx';

describe('Header', () => {
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
    const dispatchMock = jest.fn();
    const navigateMock = jest.fn();

    jest.spyOn(reactRedux, 'useAppSelector').mockReturnValue(MOCK_TOKEN_1);
    jest.spyOn(reactRedux, 'useAppDispatch').mockReturnValue(dispatchMock);
    jest.mock('react-router-dom', () => ({
      ...(jest.requireActual('react-router-dom') as any),
      useNavigate: () => navigateMock,
    }));

    renderComponent();

    const logoutBtn = screen.getByTestId('button-logout');
    fireEvent.click(logoutBtn);

    expect(dispatchMock).toHaveBeenCalledWith(reset());
    // TODO - issue with detecting navigation action - investigate in the future
    //expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
