import { gql } from '@apollo/client';

// ----- USER -----
export const REGISTER_USER = gql`
  mutation registerUser($input: RegisterInput!) {
    registerUser(input: $input) {
      userId
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($input: LoginInput!) {
    loginUser(input: $input) {
      userId
      token
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      fullname
      email
      username
      bio
      location
      followers
      following
      profilePictureUrl
      bgPictureUrl
      createdAt
      updatedAt
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation followUser($id: ID!) {
    followUser(id: $id) {
      id
      fullname
      email
      username
      bio
      location
      followers
      following
      profilePictureUrl
      bgPictureUrl
      createdAt
      updatedAt
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation unfollowUser($id: ID!) {
    unfollowUser(id: $id) {
      id
      fullname
      email
      username
      bio
      location
      followers
      following
      profilePictureUrl
      bgPictureUrl
      createdAt
      updatedAt
    }
  }
`;

export const UPLOAD_PERSONAL_PICTURE = gql`
  mutation uploadPersonalPicture($image: Upload!, $type: String!) {
    uploadPersonalPicture(image: $image, type: $type) {
      id
      fullname
      email
      username
      bio
      location
      followers
      following
      profilePictureUrl
      bgPictureUrl
      createdAt
      updatedAt
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $oldPassword: String!
    $newPassword: String!
    $confirmPassword: String!
  ) {
    changePassword(
      oldPassword: $oldPassword
      newPassword: $newPassword
      confirmPassword: $confirmPassword
    ) {
      id
      fullname
      email
      username
      bio
      location
      followers
      following
      profilePictureUrl
      bgPictureUrl
      createdAt
      updatedAt
    }
  }
`;

// ---- POST ----
export const CREATE_POST = gql`
  mutation createPost($input: CreatePostInput!) {
    createPost(input: $input) {
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

export const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
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

export const UNLIKE_POST = gql`
  mutation unlikePost($postId: ID!) {
    unlikePost(postId: $postId) {
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
      poll {
        caption
        choices {
          body
          seq
          votes {
            userId
            createdAt
          }
        }
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      success
      postId
      deletedAt
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $text: String!) {
    createComment(postId: $postId, text: $text) {
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
      poll {
        caption
        choices {
          body
          seq
          votes {
            userId
            createdAt
          }
        }
      }
    }
  }
`;
