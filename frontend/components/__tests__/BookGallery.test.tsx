import React from "react";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import BookGallery from "../BookGallery";
import { buildBook, buildBookshelf } from "../../test/generate";
import { Book } from "../../graphql/books";

let books: Book[];

beforeEach(async () => {
  const book1 = await buildBook();
  const book2 = await buildBook();
  const book3 = await buildBook();
  books = [book1, book2, book3];
});

afterEach(() => {
  cleanup();
});

test("<BookGallery /> renders a list of book cards", async () => {
  render(<BookGallery books={books} />);

  expect(screen.getByTestId("cards").hasChildNodes).toBeTruthy();
  expect(screen.getByTestId("cards").childNodes).toHaveLength(3);
});

test("<BookGallery /> renders a list of book cards with remove buttons", async () => {
  const bookshelf = await buildBookshelf();
  render(
    <MockedProvider>
      <BookGallery books={books} displayRemove={true} bookshelf={bookshelf} />
    </MockedProvider>
  );

  expect(screen.getByTestId("cards")).toBeInTheDocument();

  const removeButtons = screen.getAllByRole("button");

  expect(removeButtons[0]).toHaveTextContent("x");
  expect(removeButtons).toHaveLength(books.length);
});
