import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import UpdateBookShelf from "./UpdateBookShelf";
import userEvent from "@testing-library/user-event";
import {
  UPDATE_BOOKSHELF_MUTATION,
  MY_BOOKSHELVES_QUERY,
} from "../../../graphql/bookshelves";
import { buildBookshelf } from "../../../test/generate";
import { toast } from "react-toastify";

jest.mock("react-toastify");

afterEach(() => {
  cleanup();
});

test("<UpdateBookshelf /> renders", async () => {
  const bookshelf = await buildBookshelf();
  const newTitle = "My Favourites";
  let updateBookshelfMutationCalled = false;
  const privacy = { value: bookshelf.privacyId, label: bookshelf.privacyLevel };

  const mocks = [
    {
      request: {
        query: UPDATE_BOOKSHELF_MUTATION,
        variables: { bookshelfId: bookshelf.id, title: newTitle },
      },
      result: () => {
        updateBookshelfMutationCalled = true;
        bookshelf.title = newTitle;
        return {
          data: {
            updateBookshelf: {
              id: bookshelf.id,
              title: bookshelf.title,
            },
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
          mybookshelves: [bookshelf],
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <UpdateBookShelf
        bookshelfId={bookshelf.id}
        title={bookshelf.title}
        privacy={privacy}
      />
    </MockedProvider>
  );

  const editButton = screen.getByRole("button");

  expect(editButton).toBeInTheDocument();

  userEvent.click(editButton);

  let form: HTMLElement;
  let titleInput: HTMLElement;
  let submitButton: HTMLElement;

  await waitFor(() => {
    form = screen.getByRole("form");
    titleInput = screen.getByLabelText(/title/i);
    submitButton = screen.getByTestId("update-button");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(titleInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    expect(form).toHaveFormValues({
      title: bookshelf.title,
    });
  });

  await userEvent.clear(titleInput);
  await userEvent.type(titleInput, "My Favourites");

  expect(form).toHaveFormValues({
    title: "My Favourites",
  });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(updateBookshelfMutationCalled).toBeTruthy();
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(`${newTitle} has been updated!`);
  });
});

test("<UpdateBookshelf /> handles update error", async () => {
  const bookshelf = await buildBookshelf();
  const newTitle = "My Favourites";
  const privacy = { value: bookshelf.privacyId, label: bookshelf.privacyLevel };

  const mocks = [
    {
      request: {
        query: UPDATE_BOOKSHELF_MUTATION,
        variables: { bookshelfId: bookshelf.id, title: newTitle },
      },
      error: new Error("can't update"),
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <UpdateBookShelf
        bookshelfId={bookshelf.id}
        title={bookshelf.title}
        privacy={privacy}
      />
    </MockedProvider>
  );

  const editButton = screen.getByRole("button");

  expect(editButton).toBeInTheDocument();

  userEvent.click(editButton);

  let form: HTMLElement;
  let titleInput: HTMLElement;
  let submitButton: HTMLElement;

  await waitFor(() => {
    form = screen.getByRole("form");
    titleInput = screen.getByLabelText(/title/i);
    submitButton = screen.getByTestId("update-button");
  });

  userEvent.clear(titleInput);
  await userEvent.type(titleInput, "My Favourites");

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(
      `There was an error updating ${bookshelf.title}`
    );
  });
});
