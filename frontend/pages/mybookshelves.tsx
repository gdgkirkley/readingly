import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { MY_BOOKSHELVES_QUERY, BookShelfData } from "../graphql/bookshelves";
import BookShelfView from "../components/BookShelf";

const BookShelfPage = styled.div`
  width: ${(props) => props.theme.maxWidth};
`;

const MyBookshelves = () => {
  const { data, loading, error } = useQuery<BookShelfData>(
    MY_BOOKSHELVES_QUERY
  );

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error! ${error.message}</p>;

  const mybookshelves = data.mybookshelves;

  return (
    <BookShelfPage>
      <h1>My Bookshelves</h1>
      <div>
        You have {mybookshelves.length || 0} bookshel
        {mybookshelves.length === 1 ? "f" : "ves"}
      </div>
      <div>
        {mybookshelves?.length ? (
          mybookshelves.map((shelf) => {
            return <BookShelfView key={shelf.id} bookshelf={shelf} />;
          })
        ) : (
          <p>You have no bookshelves</p>
        )}
      </div>
    </BookShelfPage>
  );
};

export default MyBookshelves;
