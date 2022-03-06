const { gql } = require('apollo-server');

module.exports = gql`
  # Low-level types
  scalar Upload

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
    id: ID
    body: String
    user: ID
    createdAt: String
  }
  type Like {
    user: ID!
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
  type ImageResponse {
    url: String!
    filename: String!
    mimetype: String!
    encoding: String!
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
  input UpdateUserInput {
    username: String!
    fullname: String!
    email: String!
    bio: String!
    location: String!
  }
  input CreatePostInput {
    postType: String!
    body: String!
    images: [Upload]!
    poll: PollInput
  }
  input DeletePostInput {
    postId: ID!
    token: String!
  }
  input ImageInput {
    uri: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }

  # Queries & Mutations
  type Query {
    getSelf: User
    getUser(id: ID!): User
    getPost(id: ID!): Post!
    getImage(id: ID!): ImageResponse!
    getPostsByUser(userId: ID!, limit: Int!): [Post]!
    getFeedFollowing(limit: Int): [Post]!
    getFeedLatest(limit: Int): [Post]!
  }

  type Mutation {
    registerUser(input: RegisterInput): LoginRegisterResponse!
    loginUser(input: LoginInput): LoginRegisterResponse!
    updateUser(input: UpdateUserInput!): User!
    followUser(id: ID!): User! #Client's own detail
    unfollowUser(id: ID!): User!
    changePassword(
      oldPassword: String!
      newPassword: String!
      confirmPassword: String!
    ): User
    uploadPersonalPicture(image: Upload!, type: String!): User
    createPost(input: CreatePostInput!): Post
    deletePost(input: DeletePostInput!): DeletedPostResponse!
    createComment(postId: ID!, text: String!): Post
    likePost(postId: ID!): Post
    unlikePost(postId: ID!): Post
  }
`;
