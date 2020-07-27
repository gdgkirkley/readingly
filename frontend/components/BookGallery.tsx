import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { BookData, BOOK_SEARCH } from "../graphql/books";
import BookCard from "./BookCard";

const BookCards = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-gap: 16px;
`;

const BookGallery = ({ searchTerm }: { searchTerm: string }) => {
  const { data, loading, error } = useQuery<BookData>(BOOK_SEARCH, {
    variables: { search: searchTerm },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return null;

  return (
    <div>
      <h2>{searchTerm}</h2>
      <BookCards>
        {data.searchBook.map((book) => {
          return <BookCard key={book.id} book={book} />;
        })}
      </BookCards>
    </div>
  );
};

export default BookGallery;
