import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import CreateBookshelf from "../CreateBookShelf";
import userEvent from "@testing-library/user-event";
import {
  CREATE_BOOKSHELF_MUTATION,
  MY_BOOKSHELVES_QUERY,
} from "../../graphql/bookshelves";
import { getUUID, buildBookshelf } from "../../test/generate";

afterEach(() => {
  cleanup();
});

test("<CreateBookshelf /> renders", async () => {
  const bookshelf = await buildBookshelf();
  const title = "Favourites";
  let createBookshelfMutationCalled = false;
  let id = await getUUID();
  const newShelf = await buildBookshelf({ title, id });

  const mocks = [
    {
      request: {
        query: CREATE_BOOKSHELF_MUTATION,
        variables: { title },
      },
      result: () => {
        createBookshelfMutationCalled = true;
        return {
          data: {
            createBookshelf: {
              id,
              title,
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
          mybookshelves: [bookshelf, newShelf],
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <CreateBookshelf />
    </MockedProvider>
  );

  const createButton = screen.getByRole("button");

  expect(createButton).toBeInTheDocument();

  userEvent.click(createButton);

  let form: HTMLElement;
  let titleInput: HTMLElement;
  let submitButton: HTMLElement;

  await waitFor(() => {
    form = screen.getByRole("form");
    titleInput = screen.getByLabelText(/title/i);
    submitButton = screen.getByRole("button", { name: /create/i });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(titleInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  await userEvent.type(titleInput, "Favourites");

  expect(form).toHaveFormValues({
    title: "Favourites",
  });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(createBookshelfMutationCalled).toBeTruthy();
  });
});
