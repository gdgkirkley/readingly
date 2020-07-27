import { gql } from "@apollo/client";

const BOOK_QUERY = gql`
  query {
    books {
      id
      title
      thumbnail
    }
  }
`;

export const BOOK_SEARCH = gql`
  query($search: String!) {
    searchBook(search: $search) {
      thumbnail
      googleBooksId
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
      categories
    }
  }
`;

export interface BookData {
  books: Book[];
  searchBook: Book[];
  googleBook: GoogleBook;
}

export interface Book {
  id: number;
  title: string;
  googleBooksId: string;
  description: string;
  authors: string[];
  thumbnail: string;
  pageCount: number;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoogleBook extends Book {
  categories: string[];
}

export default BOOK_QUERY;
