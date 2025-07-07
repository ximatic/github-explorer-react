import { render, screen } from '@testing-library/react';

import { useApolloClient } from '@apollo/client';

import { ApolloGraphqlProvider, apolloClient } from '../src/ApolloProvider';

function TestChild() {
  const client = useApolloClient();

  return <div data-testid='test-child'>{client === apolloClient ? 'Apollo OK' : 'Apollo FAIL'}</div>;
}

describe('ApolloGraphqlProvider', () => {
  it('renders children', () => {
    render(
      <ApolloGraphqlProvider>
        <div data-testid='child'>Hello</div>
      </ApolloGraphqlProvider>,
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('provides the Apollo client context', () => {
    render(
      <ApolloGraphqlProvider>
        <TestChild />
      </ApolloGraphqlProvider>,
    );

    expect(screen.getByTestId('test-child')).toHaveTextContent('Apollo OK');
  });
});
