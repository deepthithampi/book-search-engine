// import { useState, useEffect } from 'react';

import { useQuery, useMutation } from '@apollo/client';

import { Container, Card, Button, Row, Col } from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';

import Auth from '../utils/auth';
import { QUERY_SINGLE_USER } from '../utils/queries';
import { MUTATION_DELETE_BOOK } from '../utils/mutations';

// import { removeBookId } from '../utils/localStorage';
// import type { User } from '../models/User';

const SavedBooks = () => {
  // const [userData, setUserData] = useState<User>({
  //   username: '',
  //   email: '',
  //   password: '',
  //   savedBooks: [],
  const profile = Auth.getProfile();
  console.log('SavedBooks - > Auth.getProfile() -> profile:', profile);
const userId = profile?.data?._id; 
console.log('Extracted userId:', userId);
//  const userId = '6739154507be8ab762f071f2';

const { data, loading, error } = useQuery(QUERY_SINGLE_USER, {
  variables: { id: userId },
  skip: !userId,
  // fetchPolicy: 'no-cache',
  // context: {
  //   headers: {
  //     Authorization: `Bearer ${Auth.getToken()}`,
  //   },
  // },
  });
  const [deleteBook] = useMutation(MUTATION_DELETE_BOOK);
  const userData = data?.getSingleUser || { username: '', savedBooks: [] };
  console.log("QUERY_SINGLE_USER -> data:", data);
  console.log("SavedBooks.tsx -> useData = ",userData);

  const handleDeleteBook = async (bookId: string) => {
    try {
      const { data } = await deleteBook({
        variables: { userId: Auth.getProfile()?.data?._id, bookId },
      });

      console.log('Book deleted:', data);
      window.location.reload();
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;

  //       if (!token) {
  //         return false;
  //       }

  //       const response = await getMe(token);

  //       if (!response.ok) {
  //         throw new Error('something went wrong!');
  //       }

  //       const user = await response.json();
  //       setUserData(user);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getUserData();
  // }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  // const handleDeleteBook = async (bookId: string) => {
  //   const token = Auth.loggedIn() ? Auth.getToken() : null;

  //   if (!token) {
  //     return false;
  //   }

  //   try {
  //     const response = await deleteBook(bookId, token);

  //     if (!response.ok) {
  //       throw new Error('something went wrong!');
  //     }

  //     const updatedUser = await response.json();
  //     setUserData(updatedUser);
  //     // upon success, remove book's id from localStorage
  //     removeBookId(bookId);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

 
  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  if (error) return <h2>Error: {error.message}</h2>;
 
  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book:any) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
