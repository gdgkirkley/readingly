import React from "react";
import styled from "styled-components";
import BookCard from "./BookCard";
import { Book } from "../graphql/books";

const BookCards = styled.div`
  display: flex;
  flex: 1 1 156px;
  flex-wrap: wrap;
  gap: 12px;
  place-items: center;
  justify-self: center;
`;

type Props = {
  books: Book[];
};

const BookGallery = ({ books }: Props) => {
  return (
    <BookCards data-testid="cards">
      {books.map((book) => {
        return <BookCard key={book.googleBooksId} book={book} />;
      })}
    </BookCards>
  );
};

export default BookGallery;
