import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { MOCK_EXPLORER_PAGE_INFO_1 } from '../../../__mocks__/explorer.mocks';

import { useAppSelector } from '../../../src/store/hooks';

import Pagination from '../../../src/explorer/components/pagination.component';

jest.mock('../../../src/store/hooks');

const mockUseAppSelector = useAppSelector as unknown as jest.Mock;

describe('Pagination', () => {
  const renderComponent = (pageInfo: any, onPaginationChange = jest.fn()) => {
    mockUseAppSelector.mockReturnValue(pageInfo);
    return render(<Pagination onPaginationChange={onPaginationChange} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // snapshot tests

  test('matches snapshot', () => {
    const { asFragment } = renderComponent(MOCK_EXPLORER_PAGE_INFO_1);

    expect(asFragment()).toMatchSnapshot();
  });

  // unit tests

  it('renders nothing if pageInfo is undefined', () => {
    renderComponent(null);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagination-dropdown')).not.toBeInTheDocument();
  });

  it('renders pagination controls when pageInfo is present', () => {
    renderComponent(MOCK_EXPLORER_PAGE_INFO_1);

    expect(screen.getByTestId('pagination-prev-btn')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-next-btn')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-dropdown')).toBeInTheDocument();
  });

  it('disables previous button if hasPreviousPage is false', () => {
    renderComponent({ ...MOCK_EXPLORER_PAGE_INFO_1, hasPreviousPage: false });

    const prevBtn = screen.getByTestId('pagination-prev-btn');

    expect(prevBtn).toBeDisabled();
  });

  it('disables next button if hasNextPage is false', () => {
    renderComponent({ ...MOCK_EXPLORER_PAGE_INFO_1, hasNextPage: false });

    const nextBtn = screen.getByTestId('pagination-next-btn');

    expect(nextBtn).toBeDisabled();
  });

  it('calls onPaginationChange when previous button is clicked', () => {
    const onPaginationChange = jest.fn();
    renderComponent(MOCK_EXPLORER_PAGE_INFO_1, onPaginationChange);

    const prevBtn = screen.getByTestId('pagination-prev-btn');
    fireEvent.click(prevBtn);

    expect(onPaginationChange).toHaveBeenCalled();
  });

  it('calls onPaginationChange when next button is clicked', () => {
    const onPaginationChange = jest.fn();
    renderComponent(MOCK_EXPLORER_PAGE_INFO_1, onPaginationChange);

    const nextBtn = screen.getByTestId('pagination-next-btn');
    fireEvent.click(nextBtn);

    expect(onPaginationChange).toHaveBeenCalled();
  });

  it('calls onPaginationChange when items per page is changed', () => {
    const onPaginationChange = jest.fn();
    renderComponent(MOCK_EXPLORER_PAGE_INFO_1, onPaginationChange);

    const dropdown = screen.getByTestId('pagination-dropdown');
    fireEvent.click(dropdown);
    const option = screen.getByText('10');
    fireEvent.click(option);

    expect(onPaginationChange).toHaveBeenCalled();
  });
});
