const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');

const { PORT, MONGODB_URL } = require('./config');
const Post = require('./models/Post');
const User = require('./models/User');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

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

// mongoose
//   .connect(MONGODB_URL)
//   .then(() => {
//     console.log('MongoDB connected successfully');
//     return server.listen({ port: PORT });
//   })
//   .then((res) => {
//     console.log(`Server running at ${res.url}`);
//   })
//   .catch((e) => console.error(e.message));
