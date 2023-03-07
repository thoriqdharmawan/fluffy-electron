import { ApolloClient, InMemoryCache } from '@apollo/client';

const HASURA_ADMIN_SECRET = import.meta.env.VITE_HASURA_ADMIN_SECRET || ''

const client = new ApolloClient({
  uri: import.meta.env.VITE_HASURA_URL,
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
  },
});

export default client;