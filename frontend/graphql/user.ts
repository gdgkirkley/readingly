import { gql } from "@apollo/client";
import { Book } from "./books";
import { BookShelf } from "./bookshelves";

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

export const SIGN_OUT_USER_MUTATION = gql`
  mutation {
    signout {
      message
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation($id: ID!, $username: String, $email: String) {
    updateUser(id: $id, username: $username, email: $email) {
      id
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation($login: String!, $oldPassword: String!, $newPassword: String!) {
    updatePassword(
      login: $login
      oldPassword: $oldPassword
      newPassword: $newPassword
    ) {
      id
    }
  }
`;

export type User = {
  id: string;
  email: string;
  username: string;
  bookshelves?: BookShelf[];
};

export type UserData = {
  me: User;
};
