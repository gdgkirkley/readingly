import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { MY_BOOKSHELF_QUERY, BookShelfData } from "../graphql/bookshelves";
import BookGallery from "./BookGallery";
import { formatDate } from "../lib/formatDates";
import { getReadingTimeString, getPeriodFromNow } from "../lib/time";
import CreateGoal from "./CreateGoal";
import UpdateGoal from "./Goal/UpdateGoal";
import { GoalType } from "../graphql/goal";

const PageStyle = styled.div`
  display: flex;
  flex-direction: column;
`;

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

const SortByBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 2rem 0;
`;

const SortByContainer = styled.div`
  width: 100%;

  @media (min-width: 1300px) {
    width: 30%;
  }
`;

type Props = {
  title: string;
};

const Bookshelf = ({ title }: Props) => {
  const { error, loading, data, refetch } = useQuery<BookShelfData>(
    MY_BOOKSHELF_QUERY,
    {
      variables: {
        title,
        orderBy: "publishDate",
      },
    }
  );

  const onSort = (option) => {
    refetch({ orderBy: option.value });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>There was an error loading this shelf.</p>;

  const shelf = data.mybookshelf;

  return (
    <PageStyle>
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
      <SortByBlock>
        <SortByContainer>
          <label htmlFor="sort">Sort By</label>
          <Select
            name="sort"
            onChange={onSort}
            options={[
              { value: "publishDate", label: "Publish Date" },
              { value: "title", label: "Title" },
              { value: "pageCount", label: "Total Pages" },
              { value: "averageRating", label: "Average Rating" },
            ]}
          />
        </SortByContainer>
      </SortByBlock>
      <BookGallery books={shelf.books} displayRemove={true} bookshelf={shelf} />
      <ShelfBlock>
        <BlockHeader>
          <h2>Goal</h2>
          {shelf.goal ? (
            <UpdateGoal goal={shelf.goal} bookshelfTitle={shelf.title} />
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
            <span
              dangerouslySetInnerHTML={{
                __html: getPeriodFromNow(shelf.goal.goalDate),
              }}
            />
            .
          </p>
        ) : null}
      </ShelfBlock>
      <p>You created this list on {formatDate(shelf.createdAt)}.</p>
    </PageStyle>
  );
};

export default Bookshelf;
