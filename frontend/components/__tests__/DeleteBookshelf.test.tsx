import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, cleanup, waitFor, wait } from "@testing-library/react";
import DeleteBookshelf from "../DeleteBookShelf";
import { buildBookshelf } from "../../test/generate";
import userEvent from "@testing-library/user-event";
import {
  DELETE_BOOKSHELF_MUTATION,
  MY_BOOKSHELVES_QUERY,
} from "../../graphql/bookshelves";
import { toast } from "react-toastify";

jest.mock("react-toastify");

afterEach(() => {
  cleanup();
});

test("<DeleteBookshelf /> renders and submits deletion", async () => {
  const bookshelf = await buildBookshelf();
  let deleteMutationCalled = false;

  const mocks = [
    {
      request: {
        query: DELETE_BOOKSHELF_MUTATION,
        variables: {
          bookshelfId: bookshelf.id,
        },
      },
      result: () => {
        deleteMutationCalled = true;
        return {
          data: {
            message: "Successfully delete bookshelf",
          },
        };
      },
    },
    {
      request: {
        query: MY_BOOKSHELVES_QUERY,
        variables: {},
      },
      result: {
        data: {
          mybookshelves: [],
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <DeleteBookshelf bookshelfId={bookshelf.id} title={bookshelf.title} />
    </MockedProvider>
  );

  const deleteButton = screen.getByRole("button");

  expect(deleteButton).toBeInTheDocument();
  expect(deleteButton).toHaveTextContent(/delete/i);

  userEvent.click(deleteButton);

  expect(screen.getByRole("dialog")).toBeInTheDocument();

  expect(screen.getByRole("heading")).toHaveTextContent(/confirm/i);

  const confirmDeleteButton = screen.getByRole("button", {
    name: /delete permanently/i,
  });
  expect(confirmDeleteButton).toBeInTheDocument();

  userEvent.click(confirmDeleteButton);

  await waitFor(() => {
    expect(deleteMutationCalled).toBeTruthy();
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(
      `${bookshelf.title} has been deleted!`
    );
  });
});

test("<DeleteBookshelf /> handles deletion error", async () => {
  const bookshelf = await buildBookshelf();

  const mocks = [
    {
      request: {
        query: DELETE_BOOKSHELF_MUTATION,
        variables: {
          bookshelfId: bookshelf.id,
        },
      },
      error: new Error("Unable to delete"),
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <DeleteBookshelf bookshelfId={bookshelf.id} title={bookshelf.title} />
    </MockedProvider>
  );

  const deleteButton = screen.getByRole("button");

  userEvent.click(deleteButton);

  const confirmDeleteButton = screen.getByRole("button", {
    name: /delete permanently/i,
  });

  userEvent.click(confirmDeleteButton);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(
      `There was an error deleting ${bookshelf.title}`
    );
  });
});
