import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import Head from "next/head";
import ReadingCard from "./ReadingCard";
import Card from "./Card";
import BookCategorySearch from "./BookCategorySearch";
import AddToBookshelf from "./AddToBookshelf";
import CreateGoal from "./CreateGoal";
import UpdateReadingProgress from "./UpdateReadingProgress";
import { Cards } from "./styles/LayoutStyles";
import Button from "./styles/ButtonStyles";
import { GOOGLE_BOOK_QUERY, BookData } from "../graphql/books";
import { formatDate } from "../lib/formatDates";
import { getReadingTimeString, getPeriodFromNow } from "../lib/time";
import { GoalType } from "../graphql/goal";
import UpdateGoal from "./Goal/UpdateGoal";
import { useUser } from "../hooks/useUser";
import GoalDisplay from "./Goal/GoalDisplay";
import { useReadMore } from "../hooks/useReadMore";
import { CreateNote, NoteList } from "./Note";

const BookPage = styled.div`
  font-size: 1.7rem;
`;

const BookBlock = styled.div`
  padding-bottom: 2rem;
  border-bottom: 1px dotted ${(props) => props.theme.black};
  margin-bottom: 2rem;
`;

const BookInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 2rem 0;

  & span {
    margin: 0 1rem;
    padding-right: 2rem;
    border-right: 1px dotted ${(props) => props.theme.black};
    min-width: 15%;
    &:last-of-type {
      border-right: none;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    font-size: 1em;

    & br {
      display: block;
    }

    & span {
      border-bottom: 1px dotted ${(props) => props.theme.black};
      border-right: none;
      margin: 1rem 0;
    }
  }
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
  font-size: 5.5rem;
  margin: 0;
  line-height: 1.1;
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
  padding: 2rem 0;

  @media (min-width: 1300px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MyActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MobileDescription = styled.div`
  display: block;

  @media (min-width: 768px) {
    display: none;
  }
`;

const Description = styled.div`
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

type Props = {
  googleBooksId: string;
};

const Book = ({ googleBooksId }: Props) => {
  const me = useUser();
  const { data, loading, error } = useQuery<BookData>(GOOGLE_BOOK_QUERY, {
    variables: { googleBooksId: googleBooksId },
  });

  const [smallDescription, toggle, readMoreToggled] = useReadMore(
    data?.googleBook.description,
    500
  );

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
    notes,
    averageTimeToReadInSeconds,
    goal,
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
      <BookInfo>
        <span>
          <strong>{pageCount}</strong> pages
          <br />
          Approx. <strong>{(pageCount * 250).toLocaleString()}</strong> words
        </span>
        <span>
          <strong>{formatDate(publishDate)}</strong>
          <br />
          Published by {publisher}
        </span>
        <span>
          <strong>{getReadingTimeString(averageTimeToReadInSeconds)}</strong>
          <br />
          average reading time
        </span>
      </BookInfo>
      <Banner background={thumbnail}>
        <BannerContent>
          {thumbnail && <img src={thumbnail} alt={title} />}
        </BannerContent>
      </Banner>
      <BookBlock>
        <TwoColContent>
          <Description>
            <Description
              dangerouslySetInnerHTML={{ __html: smallDescription }}
              data-testid="book-description"
            />
            <Button
              themeColor="red"
              className="no-left-margin"
              invert={true}
              onClick={toggle}
            >
              Read {readMoreToggled ? "less" : "more"}
            </Button>
          </Description>
          <div>
            <Card position="sticky">
              {me ? (
                <>
                  <AddToBookshelf book={data.googleBook} />
                  {bookshelves?.length ? (
                    <div>
                      On My Shelves:{" "}
                      {bookshelves.map((shelf, index) => (
                        <p key={shelf.id}>
                          <Link href={`/shelf/${encodeURI(shelf.title)}`}>
                            {shelf.title}
                          </Link>
                        </p>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <Link href="/signin" passHref={true}>
                  <Button as="a" themeColor="yellow">
                    Sign in to add this book!
                  </Button>
                </Link>
              )}
            </Card>
          </div>
        </TwoColContent>
      </BookBlock>
      {bookshelves?.length || goal?.goalDate ? (
        <BookBlock>
          <MyActivityHeader>
            <h2>My Goal</h2>
            {goal?.goalDate ? (
              <UpdateGoal goal={goal} />
            ) : (
              <CreateGoal
                goalableId={googleBooksId}
                goalableType={GoalType.Book}
              />
            )}
          </MyActivityHeader>
          {goal?.goalDate ? <GoalDisplay title={title} goal={goal} /> : null}
        </BookBlock>
      ) : null}
      {/* If it's added to a bookshelf, or user already has reading history*/}
      {bookshelves?.length || reading?.length ? (
        <BookBlock>
          <MyActivityHeader>
            <h2>My Reading</h2>
            <UpdateReadingProgress book={data.googleBook} />
          </MyActivityHeader>

          {reading?.length ? (
            <Cards>
              {reading.map((read) => (
                <ReadingCard
                  key={read.id}
                  reading={read}
                  totalPages={pageCount}
                  googleBooksId={googleBooksId}
                />
              ))}
            </Cards>
          ) : null}
        </BookBlock>
      ) : null}

      {bookshelves.length || reading?.length ? (
        <BookBlock>
          <MyActivityHeader>
            <h2>My Notes</h2>
            <CreateNote googleBooksId={googleBooksId} />
          </MyActivityHeader>
          {notes?.length ? <NoteList notes={notes} /> : null}
        </BookBlock>
      ) : null}

      <MobileDescription>
        <MobileDescription
          dangerouslySetInnerHTML={{ __html: smallDescription }}
          data-testid="book-description"
        />
        <Button
          themeColor="red"
          invert={true}
          className="no-left-margin"
          onClick={toggle}
        >
          Read {readMoreToggled ? "less" : "more"}
        </Button>
      </MobileDescription>

      <div>
        <h2>Check These Out</h2>
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
