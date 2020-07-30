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

test("<BookShelfListing /> renders a placeholder if no books", async () => {
  const bookshelf = await buildBookshelf({ books: [], bookCount: 0 });

  render(<BookShelfListing bookshelf={bookshelf} />);

  expect(screen.getByTestId("book-image-placeholder")).toBeInTheDocument();
  expect(
    screen.getByTestId("bookshelf-count").textContent
  ).toMatchInlineSnapshot(`"There are 0 books on this list"`);
});
