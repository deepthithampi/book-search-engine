import User, { UserDocument } from '../models/User.js';
import fetch from 'node-fetch';
import { signToken } from '../services/auth.js';

interface Book {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

const resolvers = {
  Query: {
    // getSingleUser: async (_parent: any, { _id, username }: { _id?: string; username?: string }): Promise<UserDocument | null> => {
    //   const params = _id ? { _id } : username ? { username } : {};
    //   return User.findOne(params);
    // },
    getSingleUser: async (_parent: any, { id }: { id: string }): Promise<UserDocument | null> => {
      return User.findById(id); // Use 'id' directly to fetch the user.
    },
    getAllUsers: async () => {
      try {
        const users = await User.find({}, 'username email savedBooks'); 
        return users;
      } catch (err) {
        throw new Error('Failed to fetch users');
      }
    },
    books: async (_parent: unknown, { query }: { query: string }): Promise<Book[]> => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
        const result = await response.json();

        if (!result.items) {
          throw new Error('No books found');
        }

        return result.items.map((item: any) => ({
          bookId: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors || [],
          description: item.volumeInfo.description || 'No description available',
          image: item.volumeInfo.imageLinks?.thumbnail || '',
          link: item.volumeInfo.infoLink || '',
        }));
      } catch (error) {
        console.error('Error fetching books:', error);
        throw new Error('Failed to fetch books from Google Books API');
      }
    },
  },
  Mutation: {
    createUser: async (_parent: any, { username, email, password,savedBooks }: { username: string; email: string; password: string; savedBooks:[Book]}) => {
      console.log('Creating user:', { username, email ,savedBooks});
      const user = await User.create({ username, email, password ,savedBooks: savedBooks||[]});
      if (!user) throw new Error('Error creating user');

      const token = signToken(user.username, user.email, user._id);
       // Log the output payload
      console.log('User created successfully:', { user, token });
      
      return { token, user };
    },
    login: async (_parent: any, { username, email, password }: { username?: string; email?: string; password: string }): Promise<{ token: string; user: UserDocument } | null> => {
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (!user) throw new Error("User not found");

      const isValidPassword = await user.isCorrectPassword(password);
      if (!isValidPassword) throw new Error("Invalid credentials");

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
  
    saveBook: async (_parent: any, {  book }: { book: any },context : any): Promise<UserDocument | null> => {
      if (!context.user || !context.user._id) {
        throw new Error("Authentication required. Please log in.");
      }
      return User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
    },
    deleteBook: async (_parent: any, { userId, bookId }: { userId: string; bookId: string }): Promise<UserDocument | null> => {
      return User.findByIdAndUpdate(
        userId,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

export default resolvers;