// These are exported to server.js to allow data requests to be properly routed.
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

module.exports = { typeDefs, resolvers };