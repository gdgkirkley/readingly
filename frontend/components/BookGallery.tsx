import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { BookData, BOOK_SEARCH } from "../graphql/books";
import BookCard from "./BookCard";

const BookCards = styled.div`
  display: flex;
  flex: 0 1 128px;
  flex-wrap: wrap;
  gap: 12px;
  place-items: center;
  justify-self: center;
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
          return <BookCard key={book.googleBooksId} book={book} />;
        })}
      </BookCards>
    </div>
  );
};

export default BookGallery;
