import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import * as router from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../src/store/hooks';

import { ExplorerEventName, ExplorerEventType } from '../../../src/explorer/store/explorer.state';
import { verifyToken } from '../../../src/explorer/store/explorer.slice';

import TokenPage from '../../../src/explorer/pages/token.page';

jest.mock('../../../src/store/hooks');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockUseAppDispatch = useAppDispatch as unknown as jest.Mock;
const mockUseAppSelector = useAppSelector as unknown as jest.Mock;
const mockUseNavigate = router.useNavigate as jest.Mock;

describe('TokenPage', () => {
  let dispatchMock: jest.Mock;
  let navigateMock: jest.Mock;

  const renderComponent = () => render(<TokenPage />);

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

  it('renders welcome and form UI', () => {
    renderComponent();

    expect(screen.getByText(/GitHub Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/Your API Token/i)).toBeInTheDocument();
  });

  it('disables submit button when token is empty', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: /start browsing/i });

    expect(button).toBeDisabled();
  });

  it('enables submit and dispatches verifyToken when token is entered', () => {
    renderComponent();

    const input = screen.getByLabelText(/token/i);
    fireEvent.change(input, { target: { value: 'abc123' } });
    const button = screen.getByRole('button', { name: /start browsing/i });
    fireEvent.click(button);

    expect(button).not.toBeDisabled();
    expect(dispatchMock).toHaveBeenCalledWith(verifyToken({ token: 'abc123', storeToken: false }));
  });

  it('shows error message when invalid token event is received', () => {
    mockUseAppSelector.mockReturnValue({
      name: ExplorerEventName.VerifyToken,
      type: ExplorerEventType.Error,
    });

    renderComponent();

    const input = screen.getByLabelText(/token/i);
    fireEvent.change(input, { target: { value: 'badtoken' } });
    fireEvent.input(input);

    expect(screen.getByText(/Provided API Token is invalid/i)).toBeInTheDocument();
  });

  it('navigates to /repositories on successful token verification', () => {
    mockUseAppSelector.mockReturnValue({
      name: ExplorerEventName.VerifyToken,
      type: ExplorerEventType.Success,
    });

    renderComponent();

    expect(navigateMock).toHaveBeenCalledWith('/repositories');
  });
});
