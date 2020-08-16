import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { MY_BOOKSHELF_QUERY, BookShelfData } from "../graphql/bookshelves";
import BookGallery from "./BookGallery";
import { formatDate } from "../lib/formatDates";
import { getReadingTimeString, getPeriodFromNow } from "../lib/time";
import CreateGoal from "./CreateGoal";
import UpdateGoal from "./UpdateGoal";
import { GoalType } from "../graphql/goal";

const ShelfBlock = styled.div`
  margin: 2rem 0;
  padding-bottom: 2rem;
  border-top: 1px dotted ${(props) => props.theme.black};

  border-bottom: 1px dotted ${(props) => props.theme.black};
`;

const BlockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type Props = {
  title: string;
};

const Bookshelf = ({ title }: Props) => {
  const { error, loading, data } = useQuery<BookShelfData>(MY_BOOKSHELF_QUERY, {
    variables: {
      title,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>There was an error loading this shelf.</p>;

  const shelf = data.mybookshelf;

  return (
    <div>
      <h1>{shelf.title}</h1>
      <p data-testid="bookshelf-count">
        There {shelf.bookCount == 1 ? "is" : "are"} {shelf.bookCount} book
        {shelf.bookCount == 1 ? null : "s"} on this list.
      </p>
      {shelf.bookCount > 0 ? (
        <p>
          It will take about{" "}
          <strong>
            {getReadingTimeString(shelf.averageTimeToReadInSeconds)}
          </strong>{" "}
          to read all the books. You can do it!
        </p>
      ) : null}
      <BookGallery books={shelf.books} displayRemove={true} bookshelf={shelf} />
      <ShelfBlock>
        <BlockHeader>
          <h2>Goal</h2>
          {shelf.goal ? (
            <UpdateGoal
              currentGoalDate={shelf.goal.goalDate}
              goalId={shelf.goal.id}
              goalableId={shelf.id}
              goalableType={GoalType.BookShelf}
              bookshelfTitle={shelf.title}
            />
          ) : (
            <CreateGoal
              goalableId={shelf.id}
              goalableType={GoalType.BookShelf}
              bookshelfTitle={shelf.title}
            />
          )}
        </BlockHeader>
        {shelf.goal ? (
          <p>
            You want to read this list by{" "}
            <strong>{formatDate(shelf.goal.goalDate)}</strong>. That's{" "}
            <strong>{getPeriodFromNow(shelf.goal.goalDate)}</strong> from now.
          </p>
        ) : null}
      </ShelfBlock>
      <p>You created this list on {formatDate(shelf.createdAt)}.</p>
    </div>
  );
};

export default Bookshelf;
