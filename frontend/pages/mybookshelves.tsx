import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { MY_BOOKSHELVES_QUERY, BookShelfData } from "../graphql/bookshelves";
import BookShelfView from "../components/BookShelfListing";
import Button from "../components/styles/ButtonStyles";
import CreateBookShelf from "../components/CreateBookShelf";

const BookShelfPage = styled.div`
  width: 100%;
  display: grid;
`;

const BookshelfHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
      <BookshelfHeader>
        <div>
          <h1>My Bookshelves</h1>
          <div>
            You have {mybookshelves.length || "no"} bookshel
            {mybookshelves.length === 1 ? "f" : "ves"}
          </div>
        </div>
        <div>
          <CreateBookShelf />
        </div>
      </BookshelfHeader>
      <div>
        {mybookshelves?.length
          ? mybookshelves.map((shelf) => {
              return <BookShelfView key={shelf.id} bookshelf={shelf} />;
            })
          : null}
      </div>
    </BookShelfPage>
  );
};

export default MyBookshelves;
