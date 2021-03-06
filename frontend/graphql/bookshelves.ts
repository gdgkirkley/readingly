import { gql } from "@apollo/client";
import { Book } from "./books";
import { Goal } from "./goal";

export const MY_BOOKSHELVES_QUERY = gql`
  query {
    mybookshelves {
      id
      title
      bookCount
      privacyId
      privacyLevel
      createdAt
      books(limit: 9) {
        googleBooksId
        title
        thumbnail
      }
    }
  }
`;

export const MY_BOOKSHELF_QUERY = gql`
  query($title: String!, $orderBy: String) {
    mybookshelf(title: $title) {
      id
      title
      createdAt
      bookCount
      averageTimeToReadInSeconds
      privacyId
      privacyLevel
      goal {
        id
        goalDate
      }
      books(orderBy: $orderBy) {
        googleBooksId
        title
        thumbnail
        authors
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
  mutation($title: String!, $privacyId: Int!) {
    createBookshelf(title: $title, privacyId: $privacyId) {
      id
      title
      privacyId
    }
  }
`;

export const UPDATE_BOOKSHELF_MUTATION = gql`
  mutation($bookshelfId: ID!, $title: String!, $privacyId: Int!) {
    updateBookshelf(
      bookshelfId: $bookshelfId
      title: $title
      privacyId: $privacyId
    ) {
      id
      title
      privacyId
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
  privacyId: number;
  privacyLevel: string;
  createdAt?: string;
  updatedAt?: string;
};
