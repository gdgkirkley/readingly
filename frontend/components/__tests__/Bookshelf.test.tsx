import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import BookShelf from "../Bookshelf";
import { buildBookshelf } from "../../test/generate";
import { MY_BOOKSHELF_QUERY } from "../../graphql/bookshelves";
import { formatDate } from "../../lib/formatDates";

afterEach(() => {
  cleanup();
});

test("<Bookshelf /> renders a bookshelf", async () => {
  const bookshelf = await buildBookshelf({ bookCount: 3 });

  console.log(bookshelf.createdAt);

  const mocks = [
    {
      request: {
        query: MY_BOOKSHELF_QUERY,
        variables: { title: bookshelf.title },
      },
      result: {
        data: {
          mybookshelf: bookshelf,
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BookShelf title={bookshelf.title} />
    </MockedProvider>
  );

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole("heading")[0]).toHaveTextContent(
      bookshelf.title
    );
    expect(
      screen.getByTestId("bookshelf-count").textContent
    ).toMatchInlineSnapshot(`"There are 3 books on this list."`);

    expect(screen.getByTestId("cards")).toBeInTheDocument();

    const dateRegex = new RegExp(formatDate(bookshelf.createdAt));
    expect(screen.getByText(dateRegex)).toBeInTheDocument();
  });
});

test("<Bookshelf /> handles error", async () => {
  const title = "A non existent bookshelf";
  const mocks = [
    {
      request: {
        query: MY_BOOKSHELF_QUERY,
        variables: { title },
      },
      error: new Error("Bookshelf not found"),
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BookShelf title={title} />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/error loading/i)).toBeInTheDocument();
  });
});
