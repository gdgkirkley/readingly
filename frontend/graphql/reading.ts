import { gql } from "@apollo/client";
import { Book } from "./books";
import { User } from "./user";

export const ADD_READING_PROGRESS_MUTATION = gql`
  mutation($progress: Float!, $googleBooksId: ID!) {
    createReading(progress: $progress, googleBooksId: $googleBooksId) {
      id
      progress
    }
  }
`;

export type Reading = {
  progress: number;
  book: Book;
  user: User;
  createdAt: string;
  updatedAt: string;
};
