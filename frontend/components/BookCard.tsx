import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { Book } from "../graphql/books";

type ContainerProps = {
  width: number;
};

const Card = styled.a`
  text-align: center;
  margin: 1rem;
  margin-left: 0;

  @media (max-width: 1300px) {
    margin: 2rem;
    margin-left: 0;
  }
`;

const ImageContainer = styled.div<ContainerProps>`
  width: ${(props) => props.width}px;
  height: auto;
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
    width: 100%;
    & img {
      width: 100%;
    }
  }
`;

type Props = {
  book: Book;
  width?: number;
};

/**
 * A book card component that displays either the image or title
 * @param book the book to display
 * @param width the width of the card. Defaults to 128px.
 */
const BookCard = ({ book, width = 128, ...rest }: Props) => {
  return (
    <Link
      href={`/book/[googleBooksId]`}
      as={`/book/${book.googleBooksId}`}
      passHref
      {...rest}
    >
      <Card>
        <ImageContainer width={width}>
          {book?.thumbnail ? (
            <img src={book.thumbnail} alt={book.title} />
          ) : (
            book.title.substring(0, 50)
          )}
        </ImageContainer>
      </Card>
    </Link>
  );
};

export default BookCard;
