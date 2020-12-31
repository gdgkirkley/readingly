import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import { matchSorter } from "match-sorter";
import { MY_BOOKSHELF_QUERY, BookShelfData } from "../graphql/bookshelves";
import BookGallery from "./BookGallery";
import { formatDate } from "../lib/formatDates";
import { getReadingTimeString, getPeriodFromNow } from "../lib/time";
import CreateGoal from "./Goal/CreateGoal";
import UpdateGoal from "./Goal/UpdateGoal";
import { GoalType } from "../graphql/goal";
import SearchBar from "./SearchBar";

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
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  border: 1px dashed #ececec;
  padding: 1rem;

  @media (min-width: 1300px) {
    grid-template-columns: 1fr 1fr;
    grid-gap: 4rem;
  }
`;

const SortByContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & label {
    align-self: center;
  }
`;

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "1px solid #e2e8f0",
    borderRadius: "1rem",
    marginBottom: "1rem",
  }),
};

type Props = {
  title: string;
};

const Bookshelf = ({ title }: Props) => {
  const [books, setBooks] = useState([]);
  const [cachedBooks, setCachedBooks] = useState([]);
  const { error, loading, data, refetch } = useQuery<BookShelfData>(
    MY_BOOKSHELF_QUERY,
    {
      variables: {
        title,
      },
    }
  );

  useEffect(() => {
    if (!data?.mybookshelf?.books?.length) return;

    setBooks(data.mybookshelf.books);
    setCachedBooks(data.mybookshelf.books);
  }, [data]);

  const onSort = (option) => {
    refetch({ orderBy: option.value });
  };

  const handleShelfSearch = ({ search }) => {
    if (search === "" || !search) {
      return setBooks(cachedBooks);
    }

    const matches = matchSorter(books, search, { keys: ["title"] });

    setBooks(matches);
  };

  const handleSearchClear = () => {
    setBooks(cachedBooks);
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
          <label htmlFor="search">Search This Bookshelf:</label>
          <SearchBar
            handleSearch={handleShelfSearch}
            displayButton={false}
            onClear={handleSearchClear}
          />
        </SortByContainer>
        <SortByContainer>
          <label htmlFor="sort">Sort Books By:</label>
          <Select
            name="sort"
            onChange={onSort}
            placeholder={"Sort Books By..."}
            styles={customSelectStyles}
            options={[
              { value: "publishDate", label: "Publish Date" },
              { value: "title", label: "Title" },
              { value: "pageCount", label: "Total Pages" },
              { value: "averageRating", label: "Average Rating" },
            ]}
          />
        </SortByContainer>
      </SortByBlock>
      <BookGallery books={books} displayRemove={true} bookshelf={shelf} />
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
