import Head from "next/head";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import BOOK_QUERY, { BookData, BOOK_SEARCH } from "../graphql/queries/books";
import BookCard from "../components/BookCard";

const BookCards = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
`;

export default function Home(): JSX.Element {
  const { data, loading } = useQuery<BookData>(BOOK_SEARCH, {
    variables: { search: "Pride and Prejudice" },
  });

  if (loading) return <p>Loading...</p>;

  return (
    <BookCards>
      {data.books.map((book) => {
        return <BookCard book={book} key={book.id} />;
      })}
    </BookCards>
  );
}
