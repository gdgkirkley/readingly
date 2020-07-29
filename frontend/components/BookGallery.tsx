import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { BookData, BOOK_SEARCH } from "../graphql/books";
import BookCard from "./BookCard";

const Gallery = styled.div`
  justify-self: center;
`;

const BookCards = styled.div`
  display: flex;
  flex: 1 1 156px;
  flex-wrap: wrap;
  gap: 12px;
  place-items: center;
  justify-self: center;
`;

type Props = {
  searchTerm: string;
};

const BookGallery = ({ searchTerm }: Props) => {
  const { data, loading, error } = useQuery<BookData>(BOOK_SEARCH, {
    variables: { search: searchTerm },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return null;

  return (
    <Gallery>
      <h2>{searchTerm}</h2>
      <BookCards data-testid="cards">
        {data.searchBook.map((book) => {
          return <BookCard key={book.googleBooksId} book={book} />;
        })}
      </BookCards>
    </Gallery>
  );
};

export default BookGallery;
