// The Apollo client is imported to allow requests through the client side appication to Apollo Server.
import { ApolloClient, InMemoryCache, ApolloProvider,  createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';


const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// The Apollo Client is initialized.
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  uri: '/graphql',
  cache: new InMemoryCache(),
});

// The Apollo Provider wraps the application's HTML elements
function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Navbar />
        <Outlet />
      </ApolloProvider>
    </>
  );
}

export default App;
