const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
const { graphqlUploadExpress } = require('graphql-upload');
const path = require('path');
require('dotenv').config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

// Static assets if in production env

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URL);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ req }), // forward the req context from server
    });
    const app = express();
    app.use(graphqlUploadExpress());
    app.use(express.static('public'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    });

    await server.start();
    server.applyMiddleware({ path: '/', app });

    await new Promise((r) => app.listen({ port: PORT }, r));
    console.log(
      `Server running at http://localhost:${PORT}${server.graphqlPath}`
    );
  } catch (err) {
    console.error(err.message);
  }
}

startServer();
