const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');
require('dotenv').config();

const Post = require('./models/Post');
const User = require('./models/User');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

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

    await server.start();
    server.applyMiddleware({ app });

    await new Promise((r) => app.listen({ port: PORT }, r));
    console.log(
      `Server running at http://localhost:${PORT}${server.graphqlPath}`
    );
  } catch (err) {
    console.error(err.message);
  }
}

startServer();
