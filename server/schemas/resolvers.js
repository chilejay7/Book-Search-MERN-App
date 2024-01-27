const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken, Authenticator } = require('../utils/auth');

const resolvers = {
    // The query refrences our one query defined in typeDefs.js.  The savedBooks field is populated to pull in the information from the Books model.
    Query: {
        me: async () => {
            return User.find().populate('savedBooks')
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = User.findOne({ email });

            if(!user) {
                throw AuthenticationError;
            }

            const correctPW = await user.isCorrectPassword(password);

            if(!correctPW) {
                throw AuthenticationError;
            }

            const token = signToken(user);

            return { token, user };
        }
    }
};

module.exports = resolvers;