import { gql } from '@apollo/client';

// Mutation to create a user
export const MUTATION_CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!,$savedBooks: [BookInput]) {
    createUser(username: $username, email: $email, password: $password, savedBooks: $savedBooks) {
      token
    user {
      id
      username
      email
      savedBooks {
          bookId
          title
          authors
          description
          image
        link
        }
    }
    }
  }
`;


// Mutation to log in a user
// export const MUTATION_LOGIN = gql`
//   mutation login($email: String!, $password: String!) {
//     login(email: $email, password: $password)
//   }
// `;

export const MUTATION_LOGIN = gql`mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      username
      email
    }
  }
}`;

// Mutation to save a book
export const MUTATION_SAVE_BOOK = gql`
  mutation saveBook( $book: BookInput!) {
    saveBook( book: $book) {
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

// Mutation to delete a book
export const MUTATION_DELETE_BOOK = gql`
  mutation deleteBook($userId: ID!, $bookId: ID!) {
    deleteBook(userId: $userId, bookId: $bookId) {
      username
      savedBooks {
        bookId
        title
      }
    }
  }
`;