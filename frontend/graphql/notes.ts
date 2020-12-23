import { gql } from "@apollo/client";
import { Book } from "./books";
import { User } from "./user";

export const NOTES_QUERY = gql`
  query($googleBooksId: googleBooksId) {
    notes(googleBooksId: $googleBooksId) {
      id
      note
      page
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_NOTE_MUTATION = gql`
  mutation($note: String!, $page: Int, $googleBooksId: ID!) {
    createNote(note: $note, page: $page, googleBooksId: $googleBooksId) {
      id
    }
  }
`;

export const UPDATE_NOTE_MUTATION = gql`
  mutation($id: ID!, $note: String!, $page: Int) {
    id
  }
`;

export const DELETE_NOTE_MUTATION = gql`
  mutation($id: ID!) {
    deleteNote(id: $id) {
      message
    }
  }
`;

export type Note = {
  id: string;
  note: string;
  page?: number;
  book?: Book;
  user?: User;
  createdAt: string;
  updatedAt: string;
};
