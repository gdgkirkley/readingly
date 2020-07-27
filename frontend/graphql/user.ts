import { gql } from "@apollo/client";

export const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      username
    }
  }
`;

export const SIGN_IN_USER_MUTATION = gql`
  mutation($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
      id
      email
      username
    }
  }
`;
