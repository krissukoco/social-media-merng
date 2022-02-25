import { gql } from '@apollo/client';

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
