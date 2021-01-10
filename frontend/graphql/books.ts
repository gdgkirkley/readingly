import { gql } from "@apollo/client";
import { BookShelf } from "./bookshelves";
import { Reading } from "./reading";
import { Goal } from "./goal";
import { Note } from "./notes";

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
      averageTimeToReadInSeconds
      reading {
        id
        progress
        timeRemainingInSeconds
        privacyLevel
        createdAt
      }
      bookshelves {
        id
        title
      }
      goal {
        id
        goalDate
        startDate
        endDate
        status
        readingRecommendation
        readingRecommendationSeconds
        goalableType
        goalableId
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
  notes?: Note[];
  bookshelves: BookShelf[];
  goal: Goal;
  thumbnail: string;
  pageCount: number;
  publishDate: string;
  categories: string[];
  publisher: string;
  averageRating: string;
  averageTimeToReadInSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export default BOOK_QUERY;
