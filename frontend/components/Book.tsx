import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { GOOGLE_BOOK_QUERY, BookData } from "../graphql/books";
import BookCategorySearch from "./BookCategorySearch";
import AddToBookshelf from "./AddToBookshelf";
import Head from "next/head";
import { getReadingTimeString } from "../lib/time";
import { formatDate } from "../lib/formatDates";
import Link from "next/link";
import UpdateReadingProgress from "./UpdateReadingProgress";
import ReadingCard from "./ReadingCard";
import Card, { ColorOptions } from "./Card";
import { Cards } from "./styles/LayoutStyles";

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

const TwoColContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2.4rem;

  @media (min-width: 1300px) {
    grid-template-columns: 2fr 1fr;
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

  const {
    title,
    thumbnail,
    authors,
    description,
    categories,
    pageCount,
    publishDate,
    publisher,
    bookshelves,
    reading,
    averageTimeToReadInSeconds,
  } = data.googleBook;

  return (
    <BookPage>
      <Head>
        <title>{title} | Readingly</title>
      </Head>
      <BannerTitle>{title}</BannerTitle>
      {authors?.length && (
        <p data-testid="book-authors">By {getAuthorString(authors)}</p>
      )}
      <p>
        <strong>{pageCount}</strong> pages | Published{" "}
        <strong>{formatDate(publishDate)}</strong> by {publisher} |{" "}
        <strong>{getReadingTimeString(averageTimeToReadInSeconds)}</strong>{" "}
        average reading time
      </p>
      <Banner background={thumbnail}>
        <BannerContent>
          {thumbnail && <img src={thumbnail} alt={title} />}
        </BannerContent>
      </Banner>
      <TwoColContent>
        <div
          dangerouslySetInnerHTML={{ __html: description }}
          data-testid="book-description"
        />
        <div>
          <Card position="sticky">
            <AddToBookshelf book={data.googleBook} />
            {bookshelves?.length ? (
              <>
                <p>
                  Bookshelves:{" "}
                  {bookshelves.map((shelf) => (
                    <span key={shelf.id}>
                      <Link href={`/shelf/${encodeURI(shelf.title)}`}>
                        {shelf.title}
                      </Link>
                    </span>
                  ))}
                </p>
              </>
            ) : null}
          </Card>
        </div>
      </TwoColContent>
      {bookshelves?.length || reading?.length ? (
        <>
          <div>
            <h2>My Activity</h2>
            {reading?.length ? (
              <>
                <p>
                  Reading:{" "}
                  {reading.map((read) => (
                    <ReadingCard
                      key={read.id}
                      reading={read}
                      totalPages={pageCount}
                    />
                  ))}
                </p>
              </>
            ) : null}
            <UpdateReadingProgress book={data.googleBook} />
          </div>
        </>
      ) : null}
      <div>
        <h2>You May Also Like</h2>
        {authors && <BookCategorySearch searchTerm={authors[0]} />}
        {categories?.length &&
          categories.map((category) => (
            <BookCategorySearch key={category} searchTerm={category} />
          ))}
      </div>
    </BookPage>
  );
};

function getAuthorString(authors: string[]) {
  return authors.map((author, i) =>
    i === authors.length - 1 ? author : author + ", "
  );
}

export default Book;
