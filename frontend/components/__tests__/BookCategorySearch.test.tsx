import React from "react";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import BookCategorySearch from "../BookCategorySearch";
import { BOOK_SEARCH } from "../../graphql/books";
import { buildBook } from "../../test/generate";

afterEach(() => {
  cleanup();
});

test("<BookGallery /> renders a list of book cards", async () => {
  const search = "The Lord of the Rings";
  const book1 = await buildBook();
  const book2 = await buildBook();
  const book3 = await buildBook();
  const mocks = [
    {
      request: {
        query: BOOK_SEARCH,
        variables: { search },
      },
      result: {
        data: {
          searchBook: [
            {
              thumbnail: book1.thumbnail,
              googleBooksId: book1.googleBooksId,
              title: book1.title,
            },
            {
              thumbnail: book2.thumbnail,
              googleBooksId: book2.googleBooksId,
              title: book2.title,
            },
            {
              thumbnail: book3.thumbnail,
              googleBooksId: book3.googleBooksId,
              title: book3.title,
            },
          ],
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BookCategorySearch searchTerm={search} />
    </MockedProvider>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByRole("heading")).toHaveTextContent(search);
    expect(screen.getByTestId("cards").hasChildNodes).toBeTruthy();
    expect(screen.getByTestId("cards").childNodes).toHaveLength(3);
  });
});

test("<BookGallery /> handles error", async () => {
  const mocks = [
    {
      request: {
        query: BOOK_SEARCH,
        variables: { search: "INVALID BOOK" },
      },
      error: new Error("Oh no!"),
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BookCategorySearch searchTerm={"INVALID BOOK"} />
    </MockedProvider>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByTestId("cards")).toBeFalsy();
  });
});
