const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken, Authenticator } = require('../utils/auth');

const resolvers = {
    // The query refrences our one query defined in typeDefs.js.  
    // The savedBooks field is populated to pull in the information from the Books model.
    // The parent parameter references the parent object, which isn't typically used in this resolver
    // The args paramter references the args object which isn't typically used in this resolver
    // The context object contains information about the authenticated user
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id}).populate('savedBooks');
            }
            throw AuthenticationError;
           
        },
        
        allUsers: async () => {
            return User.find();
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            console.log(`The user's email is: ${email} and their password is: ${password}`)
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