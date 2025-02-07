import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

interface ApolloGraphqlProviderProps {
  readonly children: React.ReactNode;
}

export const apolloClient = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  cache: new InMemoryCache(),
});

export default function ApolloGraphqlProvider({ children }: ApolloGraphqlProviderProps) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
