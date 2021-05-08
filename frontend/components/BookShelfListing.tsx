import React from "react";
import styled from "styled-components";
import { BookShelf } from "../graphql/bookshelves";
import BookImagePlaceholder from "./BookImagePlaceholder";
import BookCard from "./BookCard";
import Link from "next/link";
import Button from "./styles/ButtonStyles";
import { UpdateBookShelf } from "./Bookshelf/";
import DeleteBookshelf from "./DeleteBookShelf";
import PrivacyIndicator from "./Privacy";

const BookShelfView = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 24px;
  margin: 20px 0px;
  justify-content: center;
  align-items: center;

  padding: 2rem 0;

  &:first-of-type {
    border-top: 1px dotted ${(props) => props.theme.black};
  }
  border-bottom: 1px dotted ${(props) => props.theme.black};

  &:last-of-type {
    border-bottom: none;
  }

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

  & img {
    border: 1px dotted ${(props) => props.theme.black};
    border-radius: 0.25rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
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
    padding: 1rem 2rem;
    border-radius: 0.25rem;

    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const Info = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Title = styled.div`
  display: flex;
  margin-right: 2rem;
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
        <Info>
          <Title>
            <h2>{bookshelf.title}</h2>
          </Title>
          <PrivacyIndicator privacyLevel={bookshelf.privacyLevel} />
        </Info>
        <p data-testid="bookshelf-count">
          There {bookshelf.bookCount == 1 ? "is" : "are"} {bookshelf.bookCount}{" "}
          book
          {bookshelf.bookCount == 1 ? null : "s"} on this list.
        </p>
        {bookshelf.books?.length ? (
          <BooksDisplay data-testid="bookshelf-books">
            {bookshelf.books.map((book) => (
              <BookCard key={book.googleBooksId} book={book} width={80} />
            ))}
          </BooksDisplay>
        ) : null}
        <Links>
          <Link
            href="/shelf/[title]"
            as={`/shelf/${encodeURI(bookshelf.title)}`}
            passHref
          >
            <Button themeColor="black" as="a">
              View all
            </Button>
          </Link>
          <UpdateBookShelf
            title={bookshelf.title}
            privacy={{
              value: bookshelf.privacyId,
              label: bookshelf.privacyLevel,
            }}
            bookshelfId={bookshelf.id}
          />
          <DeleteBookshelf title={bookshelf.title} bookshelfId={bookshelf.id} />
        </Links>
      </div>
    </BookShelfView>
  );
};

export default BookShelfListing;
