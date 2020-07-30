import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import AddToBookshelf from "../AddToBookshelf";
import { CURRENT_USER_QUERY } from "../../graphql/user";
import {
  ADD_BOOK_MUTATION,
  MY_BOOKSHELVES_QUERY,
} from "../../graphql/bookshelves";
import { buildBookshelf, buildBook, buildUser } from "../../test/generate";

afterEach(() => {
  cleanup();
});

test("<AddToBookshelf /> renders when user present", async () => {
  const user = await buildUser();
  const bookshelf = await buildBookshelf();
  const book = await buildBook();

  const mocks = [
    {
      request: {
        query: CURRENT_USER_QUERY,
        variables: {},
      },
      result: {
        data: {
          me: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
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
      <AddToBookshelf book={book} />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent(/bookshelf/i);
  });
});
