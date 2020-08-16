import { gql } from "@apollo/client";
import { Book } from "./books";
import { Goal } from "./goal";

export const MY_BOOKSHELVES_QUERY = gql`
  query {
    mybookshelves {
      id
      title
      bookCount
      books(limit: 10) {
        googleBooksId
        title
        thumbnail
      }
    }
  }
`;

export const MY_BOOKSHELF_QUERY = gql`
  query($title: String!) {
    mybookshelf(title: $title) {
      id
      title
      createdAt
      bookCount
      averageTimeToReadInSeconds
      goal {
        id
        goalDate
      }
      books {
        googleBooksId
        title
        thumbnail
      }
    }
  }
`;

export const ADD_BOOK_MUTATION = gql`
  mutation($googleBookId: ID!, $bookshelfId: ID!) {
    addBook(googleBookId: $googleBookId, bookshelfId: $bookshelfId) {
      bookCount
    }
  }
`;

export const REMOVE_BOOK_MUTATION = gql`
  mutation($googleBooksId: ID!, $bookshelfId: ID!) {
    removeBook(googleBooksId: $googleBooksId, bookshelfId: $bookshelfId) {
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
  mybookshelf: BookShelf;
};

export type BookShelf = {
  id: string;
  title: string;
  bookCount: number;
  books?: Book[];
  averageTimeToReadInSeconds: number;
  goal: Goal;
  createdAt?: string;
  updatedAt?: string;
};
