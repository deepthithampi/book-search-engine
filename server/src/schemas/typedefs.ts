const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  type Query {
    getSingleUser(id: ID!): User
    getAllUsers: [User]
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String
    saveBook(userId: ID!, book: BookInput!): User
    deleteBook(userId: ID!, bookId: ID!): User
  }

  input BookInput {
    bookId: ID!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }
`;

export default typeDefs;