import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { BookData, BOOK_SEARCH } from "../graphql/books";
import BookGallery from "./BookGallery";
import Button from "./styles/ButtonStyles";

const Gallery = styled.div`
  justify-self: center;
`;

const Action = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

type Props = {
  searchTerm: string;
};

const BookCategorySearch = ({ searchTerm }: Props) => {
  const { data, loading, error, fetchMore } = useQuery<BookData>(BOOK_SEARCH, {
    variables: { search: searchTerm, offset: 0, limit: 21 },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const handleLoadMore = (): void => {
    fetchMore({
      variables: {
        offset: data.searchBook.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        console.log(fetchMoreResult);
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          searchBook: [...prev.searchBook, ...fetchMoreResult.searchBook],
        });
      },
    });
  };

  if (!data && loading) return <p>Loading...</p>;

  if (error || !data) return null;

  return (
    <Gallery>
      <h3>{searchTerm}</h3>
      <BookGallery books={data.searchBook} />
      {loading ? <p>Loading more...</p> : null}
      <Action>
        <Button themeColor="red" onClick={handleLoadMore} disabled={loading}>
          Load{loading ? "ing" : ""} more
        </Button>
      </Action>
    </Gallery>
  );
};

export default BookCategorySearch;
