import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { BookData, BOOK_SEARCH } from "../graphql/books";
import BookGallery from "./BookGallery";

const Gallery = styled.div`
  justify-self: center;
`;

type Props = {
  searchTerm: string;
};

const BookCategorySearch = ({ searchTerm }: Props) => {
  const { data, loading, error } = useQuery<BookData>(BOOK_SEARCH, {
    variables: { search: searchTerm },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return null;

  return (
    <Gallery>
      <h2>{searchTerm}</h2>
      <BookGallery books={data.searchBook} />
    </Gallery>
  );
};

export default BookCategorySearch;
