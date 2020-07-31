import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { GOOGLE_BOOK_QUERY, BookData } from "../graphql/books";
import BookCategorySearch from "./BookCategorySearch";
import AddToBookshelf from "./AddToBookshelf";

const BookPage = styled.div`
  font-size: 1.7rem;
`;

const Banner = styled.div<{ background: string }>`
  position: relative;
  padding: 2rem 5rem;
  margin-bottom: 4rem;
  overflow-y: hidden;
  border-radius: 0.25rem;
  font-size: 18vw;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: "";
    background: ${(props) =>
      props.background ? `url(${props.background})` : props.theme.red};
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    filter: blur(6px);
    transform: skewY(-6deg);
    transform-origin: top left;
  }
`;

const BannerContent = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  & img {
    box-shadow: 0 3px 22px 3px #fff;
    width: 200px;
  }
`;

const BannerTitle = styled.h1`
  font-size: 5rem;
  margin: 0;
  line-height: 1;
  position: relative;
  margin-bottom: 20px;
  max-width: 70%;

  @media (max-width: 1300px) {
    max-width: 100%;
  }
`;

type Props = {
  googleBooksId: string;
};

const Book = ({ googleBooksId }: Props) => {
  const { data, loading, error } = useQuery<BookData>(GOOGLE_BOOK_QUERY, {
    variables: { googleBooksId: googleBooksId },
  });

  if (loading) return <p>Loading....</p>;

  if (error) return <p>Uh oh! {error.message}</p>;

  return (
    <BookPage>
      <Banner background={data.googleBook.thumbnail}>
        <BannerContent>
          {data.googleBook.thumbnail && (
            <img src={data.googleBook.thumbnail} alt={data.googleBook.title} />
          )}
        </BannerContent>
      </Banner>
      <BannerTitle>{data.googleBook.title}</BannerTitle>
      {data.googleBook?.authors?.length && (
        <p data-testid="book-authors">
          By {data.googleBook.authors.map((author) => author)}
        </p>
      )}
      <AddToBookshelf book={data.googleBook} />
      <div
        dangerouslySetInnerHTML={{ __html: data.googleBook.description }}
        data-testid="book-description"
      />
      <div>
        <h2>You May Also Like</h2>
        {data.googleBook.authors && (
          <BookCategorySearch searchTerm={data.googleBook.authors[0]} />
        )}
        {data.googleBook?.categories?.length &&
          data.googleBook.categories.map((category) => (
            <BookCategorySearch key={category} searchTerm={category} />
          ))}
      </div>
    </BookPage>
  );
};

export default Book;
