import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import Book from "../Book";
import { MY_BOOKSHELVES_QUERY } from "../../graphql/bookshelves";
import { CURRENT_USER_QUERY } from "../../graphql/user";
import { GOOGLE_BOOK_QUERY, BOOK_SEARCH } from "../../graphql/books";
import { buildBook, buildUser, buildBookshelf } from "../../test/generate";

afterEach(() => {
  cleanup();
});

test("<Book /> renders a book", async () => {
  const bookshelf = await buildBookshelf();
  const user = await buildUser();
  const book = await buildBook({
    googleBooksId: "test123",
    bookshelves: [bookshelf],
  });
  const book2 = await buildBook();
  const book3 = await buildBook();
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
        query: GOOGLE_BOOK_QUERY,
        variables: {
          googleBooksId: "test123",
        },
      },
      result: {
        data: {
          googleBook: book,
        },
      },
    },
    // The following two are for the AddToBookshelf component
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
        query: BOOK_SEARCH,
        variables: {
          search: book.authors[0],
          limit: 16,
          offset: 0,
        },
      },
      result: {
        data: {
          searchBook: [
            {
              thumbnail: book2.thumbnail,
              googleBooksId: book2.googleBooksId,
              title: book2.title,
            },
          ],
        },
      },
    },
    {
      request: {
        query: BOOK_SEARCH,
        variables: {
          search: book.categories[0],
          limit: 16,
          offset: 0,
        },
      },
      result: {
        data: {
          searchBook: [
            {
              thumbnail: book3.thumbnail,
              googleBooksId: book3.googleBooksId,
              title: book3.title,
            },
          ],
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Book googleBooksId="test123" />
    </MockedProvider>
  );

  expect(screen.getByText(/loading/i)).toBeTruthy();

  await waitFor(() => {
    const headings = screen.getAllByRole("heading");
    expect(headings[0]).toHaveTextContent(book.title);
    expect(headings[1]).toHaveTextContent(/goal/i);
    expect(headings[2]).toHaveTextContent(/reading/i);
    expect(headings[3]).toHaveTextContent(/check these out/i);
    expect(headings[4]).toHaveTextContent(book.authors[0]);
    expect(headings[5]).toHaveTextContent(book.categories[0]);

    const images = screen.getAllByRole("img");

    expect(images[0]).toHaveAttribute("src", book.thumbnail);
    expect(images[1]).toHaveAttribute("src", book2.thumbnail);
    expect(images[2]).toHaveAttribute("src", book3.thumbnail);

    expect(screen.getAllByTestId("book-description")[0]).toHaveTextContent(
      book.description
    );
    const authorRegex = new RegExp(book.authors[0], "i");
    expect(screen.getByTestId("book-authors")).toHaveTextContent(authorRegex);
  });
});

test("<Book /> renders a sign in button when not logged in", async () => {
  const book = await buildBook({
    googleBooksId: "test123",
    bookshelves: null,
    goal: null,
  });
  const book2 = await buildBook();
  const book3 = await buildBook();
  const mocks = [
    {
      request: {
        query: CURRENT_USER_QUERY,
        variables: {},
      },
      result: {
        data: {
          me: null,
        },
      },
    },
    {
      request: {
        query: GOOGLE_BOOK_QUERY,
        variables: {
          googleBooksId: "test123",
        },
      },
      result: {
        data: {
          googleBook: book,
        },
      },
    },
    {
      request: {
        query: BOOK_SEARCH,
        variables: {
          search: book.authors[0],
          limit: 16,
          offset: 0,
        },
      },
      result: {
        data: {
          searchBook: [
            {
              thumbnail: book2.thumbnail,
              googleBooksId: book2.googleBooksId,
              title: book2.title,
            },
          ],
        },
      },
    },
    {
      request: {
        query: BOOK_SEARCH,
        variables: {
          search: book.categories[0],
          limit: 16,
          offset: 0,
        },
      },
      result: {
        data: {
          searchBook: [
            {
              thumbnail: book3.thumbnail,
              googleBooksId: book3.googleBooksId,
              title: book3.title,
            },
          ],
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Book googleBooksId="test123" />
    </MockedProvider>
  );

  const signInLink = await screen.findByRole("link", { name: /sign in/i });

  expect(signInLink).toBeInTheDocument();
});
