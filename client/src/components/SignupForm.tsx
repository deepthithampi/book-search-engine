import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { MUTATION_CREATE_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignupForm = ({ handleModalClose }: { handleModalClose: () => void }) => {
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // GraphQL mutation for creating a user
  const [createUser] = useMutation(MUTATION_CREATE_USER);
 
  console.log('User form data being sent:', userFormData);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // const updatedFormData = { ...userFormData, [name]: value };//new 
    // console.log(`Input Changed: ${name} = ${value}`); // Debug log
    setUserFormData({ ...userFormData, [name]: value });
    // console.log('Updated userFormData:', updatedFormData); //new 
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Final User Data Being Sent:", userFormData);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await createUser({
        variables: { ...userFormData },
        // variables: {
        //   username: userFormData.username,
        //   email: userFormData.email,
        //   password: userFormData.password,
        //   savedBooks: [
        //     {
        //       bookId: '1',
        //       title: 'Example Book ',
        //       authors: ['Author Name'],
        //       description: 'A book for testing.',
        //       image: 'http://example.com/image.jpg',
        //       link: 'http://example.com',
        //     },
        //   ], // Add a sample book for testing
        // },
      });
      console.log('Response from createUser response:', data);

      if (!data?.createUser) {
        throw new Error('Something went wrong!');
      }

      const { token } = data.createUser;
      Auth.login(token);
      handleModalClose();
    } catch (err) {
      // console.error(err);
      console.error('Error in creating user:', err);
      setShowAlert(true);
    }

    setUserFormData({ username: '', email: '', password: '' });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
          Something went wrong with your signup!
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            value={userFormData.username}
            onChange={handleInputChange}
            required
          />
          <Form.Control.Feedback type="invalid">Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            value={userFormData.email}
            onChange={handleInputChange}
            required
          />
          <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            value={userFormData.password}
            onChange={handleInputChange}

            required
          />
          <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
