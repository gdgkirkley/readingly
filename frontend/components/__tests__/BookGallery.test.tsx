import React from "react";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import BookGallery from "../BookGallery";
import { buildBook } from "../../test/generate";

afterEach(() => {
  cleanup();
});

test("<BookGallery /> renders a list of book cards", async () => {
  const book1 = await buildBook();
  const book2 = await buildBook();
  const book3 = await buildBook();
  const books = [book1, book2, book3];

  render(<BookGallery books={books} />);

  expect(screen.getByTestId("cards").hasChildNodes).toBeTruthy();
  expect(screen.getByTestId("cards").childNodes).toHaveLength(3);
});
