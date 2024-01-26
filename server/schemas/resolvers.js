const { User, Book } = require('../models');
const { signToken, Authenticator } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async () => {
            return User.find().populate('savedBooks')
        },
    },
}