import React from "react";
import styled from "styled-components";
import { BookShelf } from "../graphql/bookshelves";
import BookImagePlaceholder from "./BookImagePlaceholder";
import Link from "next/link";

const BookShelfListing = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 24px;
  margin: 20px 0px;

  & h2,
  p {
    margin: 0;
  }

  & a {
  }
`;

const ImageContainer = styled.div`
  width: 180px;
  height: 280px;
`;

type Props = {
  bookshelf: BookShelf;
};

const BookShelfView = ({ bookshelf }: Props) => {
  return (
    <BookShelfListing>
      <ImageContainer>
        {bookshelf.books?.length ? (
          <img
            src={bookshelf.books[0].thumbnail}
            alt={bookshelf.books[0].title}
          />
        ) : (
          <BookImagePlaceholder />
        )}
      </ImageContainer>
      <div>
        <h2>{bookshelf.title}</h2>
        <p>
          There are {bookshelf.books?.length || 0} book
          {bookshelf.books?.length == 1 ? null : "s"} on this list
        </p>
        <div>
          <Link href="/books" passHref>
            <a>Add a book</a>
          </Link>
        </div>
      </div>
    </BookShelfListing>
  );
};

export default BookShelfView;
