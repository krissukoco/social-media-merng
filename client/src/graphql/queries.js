import { gql } from '@apollo/client';

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
