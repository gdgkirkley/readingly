import { gql } from "@apollo/client";
import { Book } from "./books";

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

// TODO create bookshelf type
export type User = {
  id: string;
  email: string;
  username: string;
  bookshelves?: {
    id: string;
    title: string;
    createdAt: string;
    user: User;
    books: Book[];
    bookCount: number;
  };
};
