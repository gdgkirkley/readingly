import { gql } from "@apollo/client";
import { Book } from "./books";

export const MY_BOOKSHELVES_QUERY = gql`
  query {
    mybookshelves {
      id
      title
      createdAt
      bookCount
      books(limit: 10) {
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

export const CREATE_BOOKSHELF_MUTATION = gql`
  mutation($title: String!) {
    createBookshelf(title: $title) {
      id
      title
    }
  }
`;

export const UPDATE_BOOKSHELF_MUTATION = gql`
  mutation($bookshelfId: ID!, $title: String!) {
    updateBookshelf(bookshelfId: $bookshelfId, title: $title) {
      id
      title
    }
  }
`;

export const DELETE_BOOKSHELF_MUTATION = gql`
  mutation($bookshelfId: ID!) {
    deleteBookshelf(bookshelfId: $bookshelfId) {
      message
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
