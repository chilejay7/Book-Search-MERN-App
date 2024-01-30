// const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

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
        // The await keyword is critical for this request to process correctly.
        // The function needs to await the results of the findOne query before continuing to process the rest of the instructions.
        login: async (parent, { email, password }) => {
            console.log(`The user's email is: ${email} and their password is: ${password}`)
            const user = await User.findOne({ email });
            console.log(`*************************************`);
            console.log(user);
            console.log(`*************************************`);

            if(!user) {
                throw AuthenticationError;
            }

            const correctPW = await user.isCorrectPassword(password);

            if(!correctPW) {
                throw AuthenticationError;
            }

            const token = signToken(user);
            // Added for debugging
            console.log(token);

            return { token, user };
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },

        // context: Represents the context object which typically contains information about the current user, authentication status, and other contextual data.
        // The resolver checks if there is a user authenticated in the current context (context.user).
        // If there is an authenticated user (context.user is truthy), the resolver attempts to find and delete the profile associated with the user.
        saveBook: async (parent, { addBook }, context) => {
            console.log(addBook);
            if (context.user) {
                console.log(context.user._id)
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: addBook } },
                    {new: true }
                );
            }
            throw AuthenticationError;
        },
    },
};

module.exports = resolvers;