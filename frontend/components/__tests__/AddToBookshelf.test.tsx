import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddToBookshelf from "../AddToBookshelf";
import { CURRENT_USER_QUERY } from "../../graphql/user";
import {
  ADD_BOOK_MUTATION,
  MY_BOOKSHELVES_QUERY,
  MY_BOOKSHELF_QUERY,
} from "../../graphql/bookshelves";
import { buildBookshelf, buildBook, buildUser } from "../../test/generate";
import { toast } from "react-toastify";
import MyBookshelves from "../../pages/mybookshelves";

jest.mock("react-toastify");

afterEach(() => {
  cleanup();
});

test("<AddToBookshelf /> renders when user present", async () => {
  const user = await buildUser();
  const bookshelf = await buildBookshelf();
  const book = await buildBook();

  let addBookMutationCalled = false;
  const originalBookCount = bookshelf.bookCount;

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
    {
      request: {
        query: ADD_BOOK_MUTATION,
        variables: {
          googleBookId: book.googleBooksId,
          bookshelfId: bookshelf.id,
        },
      },
      result: () => {
        addBookMutationCalled = true;
        bookshelf.bookCount = bookshelf.bookCount + 1;
        bookshelf.books.push(book);
        return {
          data: {
            addBook: {
              bookCount: bookshelf.bookCount,
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
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AddToBookshelf book={book} />
    </MockedProvider>
  );

  let button: HTMLElement;

  await waitFor(() => {
    button = screen.getByRole("button");
  });

  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent(/bookshelf/i);

  userEvent.click(button);

  await waitFor(() => {
    expect(addBookMutationCalled).toBeTruthy();
    expect(button).toBeInTheDocument();
    expect(bookshelf.books).toContain(book);
    expect(bookshelf.bookCount).toBe(originalBookCount + 1);
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(
      `${book.title} added to ${bookshelf.title}!`
    );
  });
});
