import { gql } from '@apollo/client';


// Query to get a single user by ID
export const QUERY_SINGLE_USER = gql`
  query getSingleUser($id: ID!) {
    getSingleUser(id: $id) {
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
// Query to get all users
export const QUERY_ALL_USERS = gql`
  query getAllUsers {
    getAllUsers {
      id
      username
      email
      savedBooks {
        bookId
        title
      }
    }
  }
`;

export const QUERY_BOOKS = gql`
  query Books($query: String!) {
  books(query: $query) {
    bookId
    title
    authors
    description
    image
    link
  }
}
`;