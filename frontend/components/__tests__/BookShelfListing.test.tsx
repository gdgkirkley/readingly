import React from "react";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import BookShelfListing from "../BookShelfListing";
import { buildBookshelf } from "../../test/generate";

afterEach(() => {
  cleanup();
});

test("<BookShelfListing /> renders a bookshelf", async () => {
  const bookshelf = await buildBookshelf();

  render(<BookShelfListing bookshelf={bookshelf} />);

  expect(screen.getByRole("heading")).toHaveTextContent(bookshelf.title);
  expect(screen.getByTestId("bookshelf-count")).toHaveTextContent(
    `There are ${bookshelf.bookCount} books on this list`
  );
  expect(screen.getByTestId("bookshelf-books").childNodes).toHaveLength(
    bookshelf.books.length
  );
});
