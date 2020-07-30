import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useLazyQuery } from "@apollo/client";
import { BOOK_SEARCH, BookData } from "../graphql/books";
import SearchBar, { SearchInputs } from "../components/SearchBar";
import BookGallery from "../components/BookGallery";

const StyledSearchPage = styled.div`
  width: ${(props) => props.theme.maxWidth};
`;

const SearchPage = () => {
  const router = useRouter();
  const [urlSearch, setURLSearch] = useState<string | null>(null);
  const [searchBook, { data, loading }] = useLazyQuery<BookData>(BOOK_SEARCH);

  useEffect(() => {
    if (router.query?.q) {
      let query: string;

      if (typeof router.query.q === "object") {
        query = router.query.q.toString();
      } else {
        query = router.query.q;
      }

      setURLSearch(query);
      searchBook({
        variables: {
          search: query,
        },
      });
    }
  }, []);

  const handleSearch = (data: SearchInputs) => {
    searchBook({
      variables: {
        search: data.search,
      },
    });
  };

  return (
    <StyledSearchPage>
      <SearchBar handleSearch={handleSearch} defaultValue={urlSearch} />
      {!loading && data?.searchBook ? (
        <BookGallery books={data.searchBook} />
      ) : null}
    </StyledSearchPage>
  );
};

export default SearchPage;
