import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import DeleteBookshelf from "../DeleteBookShelf";
import { buildBookshelf } from "../../test/generate";
import userEvent from "@testing-library/user-event";

afterEach(() => {
  cleanup();
});

test("<DeleteBookshelf /> renders", async () => {
  const bookshelf = await buildBookshelf();

  render(
    <MockedProvider>
      <DeleteBookshelf bookshelfId={bookshelf.id} title={bookshelf.title} />
    </MockedProvider>
  );

  const deleteButton = screen.getByRole("button");

  expect(deleteButton).toBeInTheDocument();
  expect(deleteButton).toHaveTextContent(/delete/i);

  userEvent.click(deleteButton);

  expect(screen.getByRole("dialog")).toBeInTheDocument();

  expect(screen.getByRole("heading")).toHaveTextContent(/confirm/i);
  expect(
    screen.getByRole("button", { name: /delete permanently/i })
  ).toBeInTheDocument();
});
