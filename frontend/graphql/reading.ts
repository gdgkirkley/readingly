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

export const UPDATE_READING_PROGRESS_MUTATION = gql`
  mutation($id: ID!, $progress: Float!) {
    updateReading(id: $id, progress: $progress) {
      id
      progress
      timeRemainingInSeconds
      createdAt
    }
  }
`;

export const DELETE_READING_PROGRESS_MUTATION = gql`
  mutation($id: ID!) {
    deleteReading(id: $id) {
      message
    }
  }
`;

export type Reading = {
  id: string;
  progress: number;
  timeRemainingInSeconds: number;
  book: Book;
  user: User;
  createdAt: string;
  updatedAt: string;
};
