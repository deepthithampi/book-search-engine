import User, { UserDocument } from '../models/User.js';
import { signToken } from '../services/auth.js';

const resolvers = {
  Query: {
    getSingleUser: async (_parent: any, { _id, username }: { _id?: string; username?: string }): Promise<UserDocument | null> => {
      const params = _id ? { _id } : username ? { username } : {};
      return User.findOne(params);
    },
  },
  Mutation: {
    createUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }): Promise<{ token: string; user: UserDocument } | null> => {
      const user = await User.create({ username, email, password });
      if (!user) throw new Error('Error creating user');
      const token = signToken(user.username, user.email, user._id);
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
    saveBook: async (_parent: any, { userId, book }: { userId: string; book: any }): Promise<UserDocument | null> => {
      return User.findByIdAndUpdate(
        userId,
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