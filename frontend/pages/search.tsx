import React from "react";
import styled from "styled-components";
import { useLazyQuery } from "@apollo/client";
import { BOOK_SEARCH, BookData } from "../graphql/books";
import SearchBar, { SearchInputs } from "../components/SearchBar";
import BookGallery from "../components/BookGallery";

const StyledSearchPage = styled.div`
  width: ${(props) => props.theme.maxWidth};
`;

const SearchPage = () => {
  const [searchBook, { data, loading }] = useLazyQuery<BookData>(BOOK_SEARCH);

  const handleSearch = (data: SearchInputs) => {
    searchBook({
      variables: {
        search: data.search,
      },
    });
  };

  return (
    <StyledSearchPage>
      <SearchBar handleSearch={handleSearch} />
      {!loading && data?.searchBook ? (
        <BookGallery books={data.searchBook} />
      ) : null}
    </StyledSearchPage>
  );
};

export default SearchPage;
