import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { Book } from "../graphql/books";

const Card = styled.a`
  text-align: center;
`;

const ImageContainer = styled.div`
  width: 128px;
  display: flex;
  justify-content: center;

  & img {
    object-fit: cover;
    display: block;
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

  @media (max-width: 1300px) {
    width: 156px;
  }
`;

type Props = {
  book: Book;
};

const BookCard = ({ book, ...rest }: Props) => {
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
