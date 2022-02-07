const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const { PORT, MONGODB_URL } = require('./config');
const Post = require('./models/Post');
const User = require('./models/User');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('MongoDB connected successfully');
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((e) => console.error(e.message));
