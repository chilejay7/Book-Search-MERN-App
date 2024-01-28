// The Apollo client is imported to allow requests through the client side appication to Apollo Server.
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

// The Apollo Client is initialized.
const client = new ApolloClient({
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
