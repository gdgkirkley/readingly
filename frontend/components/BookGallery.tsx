import React from "react";
import styled from "styled-components";
import BookCard from "./BookCard";
import { Book } from "../graphql/books";
import RemoveBook from "./RemoveBook";
import { BookShelf } from "../graphql/bookshelves";

const BookCards = styled.div`
  display: flex;
  flex: 0 1 156px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  justify-self: center;
  width: 100%;

  @media (max-width: 1300px) {
    justify-content: center;
  }
`;

const BookCardContainer = styled.div`
  position: relative;
`;

const RemoveBookButton = styled(RemoveBook)`
  position: absolute;
  top: 0px;
  right: 0px;
`;

type Props = {
  books: Book[];
  displayRemove?: boolean;
  bookshelf?: BookShelf;
};

const BookGallery = ({ books, displayRemove = false, bookshelf }: Props) => {
  return (
    <BookCards data-testid="cards">
      {books.map((book) => {
        return displayRemove ? (
          <BookCardContainer key={book.googleBooksId}>
            <BookCard book={book} />
            <RemoveBookButton bookshelf={bookshelf} book={book} />
          </BookCardContainer>
        ) : (
          <BookCard key={book.googleBooksId} book={book} />
        );
      })}
    </BookCards>
  );
};

export default BookGallery;
