import React from "react";
import styled from "styled-components";
import { BookShelf } from "../graphql/bookshelves";
import BookImagePlaceholder from "./BookImagePlaceholder";
import BookCard from "./BookCard";
import Link from "next/link";
import Button from "./styles/ButtonStyles";
import UpdateBookshelf from "./UpdateBookShelf";
import DeleteBookshelf from "./DeleteBookShelf";

const BookShelfView = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 24px;
  margin: 20px 0px;
  justify-content: center;
  align-items: center;

  padding: 2rem 0;

  border-top: 1px solid ${(props) => props.theme.lightgrey};
  border-bottom: 1px solid ${(props) => props.theme.lightgrey};

  & h2,
  p {
    margin: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageContainer = styled.div`
  width: 180px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BooksDisplay = styled.div`
  display: flex;
  flex: 1 1 80px;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0px;

  & img {
    width: 80px;
  }
`;

const Links = styled.div`
  display: flex;
  margin-top: 40px;

  & a {
    color: #fff;
    padding: 1rem 2rem;
    border-radius: 0.25rem;

    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

type Props = {
  bookshelf: BookShelf;
};

const BookShelfListing = ({ bookshelf }: Props) => {
  return (
    <BookShelfView>
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
        <p data-testid="bookshelf-count">
          There {bookshelf.bookCount == 1 ? "is" : "are"} {bookshelf.bookCount}{" "}
          book
          {bookshelf.bookCount == 1 ? null : "s"} on this list
        </p>
        {bookshelf.books?.length ? (
          <BooksDisplay data-testid="bookshelf-books">
            {bookshelf.books.map((book) => (
              <BookCard key={book.id} book={book} width={80} />
            ))}
          </BooksDisplay>
        ) : null}
        <Links>
          <Link href="/books" passHref>
            <Button themeColor="black" as="a">
              View all
            </Button>
          </Link>
          <UpdateBookshelf title={bookshelf.title} bookshelfId={bookshelf.id} />
          <DeleteBookshelf title={bookshelf.title} bookshelfId={bookshelf.id} />
        </Links>
      </div>
    </BookShelfView>
  );
};

export default BookShelfListing;
