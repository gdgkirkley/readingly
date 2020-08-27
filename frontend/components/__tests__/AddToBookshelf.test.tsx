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
import { GOOGLE_BOOK_QUERY } from "../../graphql/books";
import { buildBookshelf, buildBook, buildUser } from "../../test/generate";
import { toast } from "react-toastify";

jest.mock("react-toastify");

afterEach(() => {
  cleanup();
});

test("<AddToBookshelf /> renders when user present", async () => {
  const user = await buildUser();
  const bookshelf = await buildBookshelf();
  const bookshelf2 = await buildBookshelf();
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
          mybookshelves: [bookshelf, bookshelf2],
        },
      },
    },
    {
      request: {
        query: GOOGLE_BOOK_QUERY,
        variables: {
          googleBooksId: book.googleBooksId,
        },
      },
      result: {
        data: {
          googleBook: {
            title: book.title,
            thumbnail: book.thumbnail,
            description: book.description,
            authors: book.authors,
            pageCount: book.pageCount,
            publishDate: book.publishDate,
            categories: book.categories,
            averageRating: book.averageRating,
            publisher: book.publisher,
            bookshelves: book.bookshelves,
            reading: book.reading,
            googleBooksId: book.googleBooksId,
          },
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

  let addButton: HTMLElement;
  let dropdownButton: HTMLElement;

  await waitFor(() => {
    addButton = screen.getByText(/choose a bookshelf/i);
    dropdownButton = screen.getByRole("button", {
      name: /open bookshelf list/i,
    });
  });

  expect(addButton).toBeInTheDocument();
  expect(addButton).toBeDisabled();

  expect(dropdownButton).toBeInTheDocument();
  expect(dropdownButton).not.toBeDisabled();

  userEvent.click(dropdownButton);

  let menu = screen.getByRole("listbox");

  expect(menu).toBeInTheDocument();

  let options = screen.getAllByRole("option");

  expect(options[0]).toHaveTextContent(bookshelf.title);
  expect(options[1]).toHaveTextContent(bookshelf2.title);

  userEvent.click(options[1]);

  // Dropdown should close after selection
  expect(menu).not.toBeInTheDocument();

  // click to reopen the menu and then query elements again
  userEvent.click(dropdownButton);
  options = screen.getAllByRole("option");
  menu = screen.getByRole("listbox");

  expect(options[0]).toHaveAttribute("aria-selected", "false");
  expect(options[1]).toHaveAttribute("aria-selected", "true");

  expect(menu).toHaveAttribute("aria-activedescendant", bookshelf2.title);
  expect(addButton).toHaveTextContent(`Add to ${bookshelf2.title}`);

  userEvent.click(options[0]);

  userEvent.click(dropdownButton);
  options = screen.getAllByRole("option");
  menu = screen.getByRole("listbox");

  expect(options[0]).toHaveAttribute("aria-selected", "true");
  expect(options[1]).toHaveAttribute("aria-selected", "false");

  expect(menu).toHaveAttribute("aria-activedescendant", bookshelf.title);
  expect(addButton).toHaveTextContent(`Add to ${bookshelf.title}`);

  userEvent.click(addButton);

  await waitFor(() => {
    expect(addBookMutationCalled).toBeTruthy();
    expect(addButton).toBeInTheDocument();
    expect(bookshelf.books).toContain(book);
    expect(bookshelf.bookCount).toBe(originalBookCount + 1);
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(
      `${book.title} added to ${bookshelf.title}!`
    );
  });

  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("<AddtoBookshelf /> handles case when user has no bookshelves", async () => {
  const user = await buildUser();
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
          mybookshelves: [],
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
    expect(screen.getByRole("link")).toHaveTextContent("Create a bookshelf");
    expect(screen.queryByText(/add to bookshelf/i)).toBeFalsy();
  });
});

test("<AddToBookshelf /> doesn't render when no user", async () => {
  const book = await buildBook();

  const mocks = [
    {
      request: {
        query: CURRENT_USER_QUERY,
        variables: {},
      },
      error: new Error("Not Authorized!"),
    },
    {
      request: {
        query: MY_BOOKSHELVES_QUERY,
        variables: {},
      },
      error: new Error("Not Authorized!"),
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AddToBookshelf book={book} />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(screen.queryByText(/add to bookshelf/i)).not.toBeInTheDocument();
  });

  // Outside click handler threw a runtime excetion when no user.
  // This ensures that it doesn't run when the user clicks on the screen.
  userEvent.click(document.querySelector("body"));
});
