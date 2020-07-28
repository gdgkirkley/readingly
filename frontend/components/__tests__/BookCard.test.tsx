import React from "react";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import BookCard from "../BookCard";
import { buildBook } from "../../test/generate";

afterEach(() => {
  cleanup();
});

test("<BookCard /> renders book thumbnail", async () => {
  const book = await buildBook();

  render(<BookCard book={book} />);

  expect(screen.getByRole("img")).toHaveAttribute("src", book.thumbnail);
  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    `/book/${book.googleBooksId}`
  );
});

test("<BookCard /> renders book title when no thumbnail present", async () => {
  const book = await buildBook({ thumbnail: null });

  render(<BookCard book={book} />);

  expect(screen.queryByRole("img")).toBeFalsy();
  expect(screen.getByText(book.title)).toBeTruthy();
  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    `/book/${book.googleBooksId}`
  );
});
