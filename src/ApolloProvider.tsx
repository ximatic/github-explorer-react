import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';

import fetch from 'cross-fetch';

interface ApolloGraphqlProviderProps {
  readonly children: React.ReactNode;
}

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: 'https://api.github.com/graphql', fetch }),
  cache: new InMemoryCache(),
});

export default function ApolloGraphqlProvider({ children }: ApolloGraphqlProviderProps) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
