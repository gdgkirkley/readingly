import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import CreateBookshelf from "./CreateBookShelf";
import {
  CREATE_BOOKSHELF_MUTATION,
  MY_BOOKSHELVES_QUERY,
} from "../../../graphql/bookshelves";
import { getUUID, buildBookshelf } from "../../../test/generate";

jest.mock("react-toastify");

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
        variables: { title, privacyId: newShelf.privacyId },
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
    titleInput = screen.getByLabelText(/called/i);
    submitButton = screen.getByRole("button", { name: /create/i });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(titleInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  await userEvent.type(titleInput, title);

  expect(form).toHaveFormValues({
    title: title,
  });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(`${title} has been created!`);
    expect(createBookshelfMutationCalled).toBeTruthy();
  });
});

test("<CreateBookshelf /> handles create error", async () => {
  const title = "Favourites";

  const mocks = [
    {
      request: {
        query: CREATE_BOOKSHELF_MUTATION,
        variables: { title },
      },
      error: new Error("Can't create shelf"),
    },
  ];

  render(
    <MockedProvider
      mocks={mocks}
      addTypename={false}
      defaultOptions={{
        mutate: {
          errorPolicy: "all",
        },
      }}
    >
      <CreateBookshelf />
    </MockedProvider>
  );

  const createButton = screen.getByRole("button");

  userEvent.click(createButton);

  let form: HTMLElement;
  let titleInput: HTMLElement;
  let submitButton: HTMLElement;

  await waitFor(() => {
    form = screen.getByRole("form");
    titleInput = screen.getByLabelText(/called/i);
    submitButton = screen.getByRole("button", { name: /create/i });
  });

  await userEvent.type(titleInput, title);

  expect(form).toHaveFormValues({
    title: title,
  });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(
      `There was an error creating bookshelf`
    );
  });
});
