import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import Book from "../Book";
import { GOOGLE_BOOK_QUERY, BOOK_SEARCH } from "../../graphql/books";
import { buildBook } from "../../test/generate";

afterEach(() => {
  cleanup();
});

test("<Book /> renders a book", async () => {
  const book = await buildBook();
  const book2 = await buildBook();
  const book3 = await buildBook();
  const mocks = [
    {
      request: {
        query: GOOGLE_BOOK_QUERY,
        variables: {
          googleBooksId: "test123",
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
          },
        },
      },
    },
    {
      request: {
        query: BOOK_SEARCH,
        variables: {
          search: book.authors[0],
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
    expect(headings[1]).toHaveTextContent(/you may also like/i);
    expect(headings[2]).toHaveTextContent(book.authors[0]);
    expect(headings[3]).toHaveTextContent(book.categories[0]);

    const images = screen.getAllByRole("img");

    expect(images[0]).toHaveAttribute("src", book.thumbnail);
    expect(images[1]).toHaveAttribute("src", book2.thumbnail);
    expect(images[2]).toHaveAttribute("src", book3.thumbnail);

    expect(screen.getByTestId("book-description")).toHaveTextContent(
      book.description
    );
    const authorRegex = new RegExp(book.authors[0], "i");
    expect(screen.getByTestId("book-authors")).toHaveTextContent(authorRegex);
  });
});
