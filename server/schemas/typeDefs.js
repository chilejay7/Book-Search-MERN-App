// Each type represents a structure of data that can be queried or mutated.
// The Book type's savedBooks field stores an array of books with an exclamation point to state it cannot be null.

// The Query type defines several queries that can be made to retrieve data. 
// The Query type in GraphQL defines the entry points for retrieving data from the server.
// When the me query is executed, it returns an object of type User.
// The me field is commonly used in authentication systems. 
// When a user is authenticated and sends a request to the GraphQL server, they can use the me query to retrieve their own user information.

// The Mutation type defines operations that modify data. 

// Documentatino on the input type can be found here: https://www.apollographql.com/tutorials/side-quest-intermediate-schema-design/03-the-input-type
// The input type is a special object type used as arguments to fields. This allows us to group and understand all of our arguments together, especially for mutations.

const typeDefs = `

type Query {
    me: User
    allUsers: [User]
}

type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]!
}

type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type input InsertBook {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(addBook: InsertBook!): User
    removeBook(bookId: ID!): User
}
`;

module.exports = typeDefs;