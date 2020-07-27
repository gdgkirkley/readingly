import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { Book } from "../graphql/queries/books";

const Card = styled.a``;

const ImageContainer = styled.div`
  position: relative;
  display: block;

  & img {
    display: block;
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 2px 2px -1px #a3a3a3;
    transition: box-shadow 0.2s, transform 0.2s;
  }
`;

const BookCard = ({ book }: { book: Book }): JSX.Element => {
  return (
    <Link href="/" passHref>
      <Card>
        {book.thumbnail && (
          <ImageContainer>
            <img src={book.thumbnail} alt={book.title} />
          </ImageContainer>
        )}
      </Card>
    </Link>
  );
};

export default BookCard;
