import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { MY_BOOKSHELVES_QUERY, BookShelfData } from "../graphql/bookshelves";
import BookShelfView from "../components/BookShelfListing";
import { CreateBookShelf } from "../components/Bookshelf/";

const BookShelfPage = styled.div`
  width: 100%;
  display: grid;
`;

const BookshelfHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const BookshelfHeaderTitle = styled.div`
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
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
        <BookshelfHeaderTitle>
          <h1>My Bookshelves</h1>
          <div>
            You have {mybookshelves.length || "no"} bookshel
            {mybookshelves.length === 1 ? "f" : "ves"}
          </div>
        </BookshelfHeaderTitle>
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
