import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import RemoveBook from "../RemoveBook";
import { buildBookshelf } from "../../test/generate";
import userEvent from "@testing-library/user-event";
import {
  REMOVE_BOOK_MUTATION,
  MY_BOOKSHELF_QUERY,
  MY_BOOKSHELVES_QUERY,
} from "../../graphql/bookshelves";
import { toast } from "react-toastify";

jest.mock("react-toastify");

afterEach(() => {
  cleanup();
});

test("<RemoveBook /> renders", async () => {
  const bookshelf = await buildBookshelf();
  const bookToRemove = bookshelf.books[0];
  let removeBookMutationCalled = false;

  const mocks = [
    {
      request: {
        query: REMOVE_BOOK_MUTATION,
        variables: {
          googleBooksId: bookToRemove.googleBooksId,
          bookshelfId: bookshelf.id,
        },
      },
      result: () => {
        removeBookMutationCalled = true;
        bookshelf.books = bookshelf.books.filter(
          (book) => book.googleBooksId !== bookToRemove.googleBooksId
        );
        return {
          data: {
            removeBook: {
              bookCount: bookshelf.books.length,
            },
          },
        };
      },
    },
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
    {
      request: {
        query: MY_BOOKSHELVES_QUERY,
        variables: {},
      },
      result: {
        data: {
          mybookshelves: [bookshelf],
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <RemoveBook bookshelf={bookshelf} book={bookToRemove} />
    </MockedProvider>
  );

  const removeButton = screen.getByRole("button", {
    name: /remove from bookshelf/i,
  });

  expect(removeButton).toBeInTheDocument();

  userEvent.click(removeButton);

  expect(screen.getByRole("dialog")).toBeInTheDocument();

  expect(screen.getByRole("heading")).toHaveTextContent(/confirm/i);

  const confirmButton = screen.getByRole("button", { name: /confirm remove/i });

  expect(confirmButton).toBeInTheDocument();

  userEvent.click(confirmButton);

  await waitFor(() => {
    expect(removeBookMutationCalled).toBeTruthy();
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(
      `${bookToRemove.title} removed from ${bookshelf.title}!`
    );
  });
});

test("<RemoveBook /> handles remove error", async () => {
  const bookshelf = await buildBookshelf();
  const bookToRemove = bookshelf.books[0];

  const mocks = [
    {
      request: {
        query: REMOVE_BOOK_MUTATION,
        variables: {
          googleBooksId: bookToRemove.googleBooksId,
          bookshelfId: bookshelf.id,
        },
      },
      error: new Error("Unable to remove book"),
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <RemoveBook bookshelf={bookshelf} book={bookToRemove} />
    </MockedProvider>
  );

  const removeButton = screen.getByRole("button", {
    name: /remove from bookshelf/i,
  });

  userEvent.click(removeButton);

  const confirmButton = screen.getByRole("button", { name: /confirm remove/i });

  userEvent.click(confirmButton);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(
      `There was an error removing ${bookToRemove.title}`
    );
  });
});
