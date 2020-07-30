import { gql } from "@apollo/client";
import { Book } from "./books";

export const MY_BOOKSHELVES_QUERY = gql`
  query {
    mybookshelves {
      id
      title
      createdAt
      bookCount
      books {
        googleBooksId
        title
        thumbnail
      }
    }
  }
`;

export const ADD_BOOK_MUTATION = gql`
  mutation($googleBookId: String!, $bookshelfId: ID!) {
    addBook(googleBookId: $googleBookId, bookshelfId: $bookshelfId) {
      bookCount
    }
  }
`;

export type BookShelfData = {
  mybookshelves?: BookShelf[];
};

export type BookShelf = {
  id: string;
  title: string;
  bookCount: number;
  books?: Book[];
  createdAt?: string;
  updatedAt?: string;
};
