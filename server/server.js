const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');

// Apollo server is imported.
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// This creates a new instance of ApolloServer
const startApolloServer = async () => {
  await server.start();

  // Express middleware is used to parse the data from incoming requests.
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // Routes are used with the REST API.  Typedefs and resolvers will be used with GrpahQL in place of the routes.
  // app.use(routes);

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`GraphQL can be accessed at http://localhost:${PORT}/graphql`);
    });
  });

};

startApolloServer();