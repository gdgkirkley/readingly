import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useLazyQuery } from "@apollo/client";
import { BOOK_SEARCH, BookData } from "../graphql/books";
import SearchBar, { SearchInputs } from "../components/SearchBar";
import BookGallery from "../components/BookGallery";
import Button from "../components/styles/ButtonStyles";

const StyledSearchPage = styled.div`
  width: ${(props) => props.theme.maxWidth};
`;

const Action = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const SearchPage = () => {
  const router = useRouter();
  const [urlSearch, setURLSearch] = useState<string | null>(null);
  const [searchBook, { data, loading, fetchMore }] = useLazyQuery<BookData>(
    BOOK_SEARCH,
    {
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    }
  );

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

  const handleLoadMore = (): void => {
    fetchMore({
      variables: {
        offset: data.searchBook.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          searchBook: [...prev.searchBook, ...fetchMoreResult.searchBook],
        });
      },
    });
  };

  return (
    <StyledSearchPage>
      <SearchBar handleSearch={handleSearch} defaultValue={urlSearch} />
      {data?.searchBook ? <BookGallery books={data.searchBook} /> : null}
      {loading ? <p>Loading...</p> : null}
      {data?.searchBook?.length ? (
        <Action>
          <Button themeColor="red" onClick={handleLoadMore} disabled={loading}>
            Load{loading ? "ing" : ""} More
          </Button>
        </Action>
      ) : null}
    </StyledSearchPage>
  );
};

export default SearchPage;
