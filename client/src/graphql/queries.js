import { gql } from '@apollo/client';

// ----- USER -----
export const GET_USER_DETAIL = gql`
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      fullname
      email
      username
      bio
      location
      following
      followers
      profilePictureUrl
      bgPictureUrl
    }
  }
`;

export const GET_SELF_DETAIL = gql`
  query getSelf {
    getSelf {
      id
      fullname
      email
      username
      bio
      location
      following
      followers
      profilePictureUrl
      bgPictureUrl
    }
  }
`;

// ----- POST -----
export const GET_POST = gql`
  query getPost($id: ID!) {
    getPost(id: $id) {
      id
      body
      user
      postType
      imgUrls
      createdAt
      updatedAt
      comments {
        id
        body
        user
        createdAt
      }
      likes {
        user
        createdAt
      }
    }
  }
`;

export const GET_FEED_LATEST = gql`
  query getFeedLatest($limit: Int) {
    getFeedLatest(limit: $limit) {
      id
      body
      user
      postType
      imgUrls
      createdAt
      updatedAt
      comments {
        id
        body
        user
        createdAt
      }
      likes {
        user
        createdAt
      }
    }
  }
`;

export const GET_FEED_FOLLOWING = gql`
  query getFeedFollowing($limit: Int) {
    getFeedFollowing(limit: $limit) {
      id
      body
      user
      postType
      imgUrls
      createdAt
      updatedAt
      comments {
        id
        body
        user
        createdAt
      }
      likes {
        user
        createdAt
      }
    }
  }
`;

export const GET_POSTS_BY_USER = gql`
  query getPostsByUser($userId: ID!, $limit: Int!) {
    getPostsByUser(userId: $userId, limit: $limit) {
      id
      body
      user
      postType
      imgUrls
      createdAt
      updatedAt
      comments {
        id
        body
        user
        createdAt
      }
      likes {
        user
        createdAt
      }
    }
  }
`;
