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
    books(query: String!): [Book]
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): AutoPayload
    login(email: String!, password: String!): AutoPayload
    saveBook( book: BookInput!): User
    deleteBook(userId: ID!, bookId: ID!): User
  }


type AutoPayload {
  token: String!
  user: User
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