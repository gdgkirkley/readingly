import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { Book } from "../graphql/books";

const Card = styled.a`
  max-width: 128px;
  text-align: center;
`;

const ImageContainer = styled.div`
  & img {
    display: block;
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 2px 2px -1px #a3a3a3;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  &:hover {
    & img {
      transform: translateY(-2px);
      box-shadow: 0 4px 4px -2px #919191;
    }
  }
`;

const BookCard = ({ book, ...rest }: { book: Book }): JSX.Element => {
  return (
    <Link
      href={`/book/[googleBooksId]`}
      as={`/book/${book.googleBooksId}`}
      passHref
      {...rest}
    >
      <Card>
        <ImageContainer>
          {book?.thumbnail ? (
            <img src={book.thumbnail} alt={book.title} />
          ) : (
            book.title
          )}
        </ImageContainer>
      </Card>
    </Link>
  );
};

export default BookCard;
