import { gql } from "@apollo/client";
import { BookShelf } from "./bookshelves";
import { User } from "./user";

const BOOK_QUERY = gql`
  query {
    books {
      googleBooksId
      title
      thumbnail
    }
  }
`;

export const BOOK_SEARCH = gql`
  query($search: String!, $offset: Int, $limit: Int) {
    searchBook(search: $search, offset: $offset, limit: $limit) {
      thumbnail
      googleBooksId
      title
    }
  }
`;

export const GOOGLE_BOOK_QUERY = gql`
  query($googleBooksId: String!) {
    googleBook(googleBooksId: $googleBooksId) {
      title
      thumbnail
      description
      authors
      pageCount
      publishDate
      publisher
      categories
      averageRating
      googleBooksId
      reading {
        id
        progress
        createdAt
      }
      bookshelves {
        id
        title
      }
    }
  }
`;

export interface BookData {
  books: Book[];
  searchBook: Book[];
  googleBook: Book;
}

export interface Book {
  title: string;
  googleBooksId: string;
  description: string;
  authors: string[];
  reading: Reading[];
  bookshelves: BookShelf[];
  thumbnail: string;
  pageCount: number;
  publishDate: string;
  categories: string[];
  publisher: string;
  averageRating: string;
  createdAt: string;
  updatedAt: string;
}

interface Reading {
  id: string;
  progress: number;
  book: Book;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export default BOOK_QUERY;
