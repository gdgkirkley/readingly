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

export interface BookData {
  books: Book[];
  searchBook: Book[];
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

export default BOOK_QUERY;
