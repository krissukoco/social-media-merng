const { gql } = require('apollo-server');

module.exports = gql`
  # Low-level types
  type Vote {
    userId: ID!
    createdAt: String!
  }
  type Choice {
    body: String!
    seq: Int!
    votes: [Vote]!
  }
  type Comment {
    id: ID!
    body: String!
    user: ID!
    createdAt: String!
    updatedAt: String!
  }
  type Like {
    user: User!
    createdAt: String!
  }
  type Poll {
    caption: String!
    choices: [Choice]!
  }

  # High level types: User, Post
  type User {
    id: ID!
    fullname: String!
    email: String!
    username: String!
    bio: String!
    location: String!
    followers: [ID]!
    following: [ID]!
    profilePictureUrl: String!
    bgPictureUrl: String!
    createdAt: String!
    updatedAt: String!
  }
  type Post {
    id: ID!
    body: String!
    user: ID!
    postType: String!
    imgUrls: [String]!
    createdAt: String!
    updatedAt: String!
    comments: [Comment]!
    likes: [Like]!
    poll: Poll
  }

  # Responses
  type LoginRegisterResponse {
    userId: ID!
    token: String!
  }
  type DeletedPostResponse {
    postId: ID!
    deletedAt: String!
  }

  # INPUTS
  input VoteInput {
    userId: ID!
    createdAt: String!
  }
  input ChoiceInput {
    body: String!
    seq: Int!
    votes: [VoteInput]!
  }
  input PollInput {
    caption: String!
    choices: [ChoiceInput]!
  }
  input RegisterInput {
    fullname: String!
    email: String!
    username: String!
    password: String!
    confirmPassword: String!
  }
  input LoginInput {
    emailOrUsername: String!
    password: String!
  }
  input CreatePostInput {
    postType: String!
    body: String!
    token: String!
    imgUrls: [String]
    poll: PollInput
  }
  input DeletePostInput {
    postId: ID!
    token: String!
  }

  # Queries & Mutations
  type Query {
    getSelf: User
    getUser(id: ID!): User!
    getPost(id: ID!): Post!
    getPostsByUser(userId: ID!, limit: Int!): [Post]!
    getFeedFollowing(limit: Int, token: String!): [Post]!
  }

  type Mutation {
    registerUser(input: RegisterInput): LoginRegisterResponse!
    loginUser(input: LoginInput): LoginRegisterResponse!
    createPost(input: CreatePostInput): Post!
    deletePost(input: DeletePostInput): DeletedPostResponse!
  }
`;
