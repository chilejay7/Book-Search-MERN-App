// // The jsonwwebtoken library is imported to handle JWT operations.
// GraphQLError is imported for error handling during authentication.
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql')

// set token secret and expiration date for JWT
const secret = 'keep it secret keep it safe';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('We ran into a problem.  Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),

  // This should define the user context and is set as middleware in the server.js file.
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    console.log(`Auth middleware running...`)
    console.log(req.body.token || req.query.token || req.headers.authorization);

    // Split the token string into an array and return actual token
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    // if token can be verified, add the decoded user's data to the request so it can be accessed in the resolver
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    // return the request object so it can be passed to the resolver as `context`
    return req;
  },

  // The signToken function accepts email, username, and _id as parameters.
  // These parameters are then used to create a JWT payload containing the provided user information.
  // The jwt.sign method is then used to sign the payload with the secret key and set the expiration time defined above.
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

