import express from 'express';
// import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';

import typeDefs from './schemas/typedefs.js';
import resolvers from './schemas/resolvers.js';
import db from './config/connection.js';
// import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  try {
    await server.start();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Attach Apollo Server middleware to the '/graphql' endpoint
    app.use('/graphql', expressMiddleware(server));

    // Serve static assets in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));

      app.get('*', (_req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

    // Connect to the database
    db.once('open', () => {
      console.log('Connected to MongoDB');
    });

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error starting Apollo Server:', error);
  }
};

startApolloServer();