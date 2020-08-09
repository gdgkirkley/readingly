import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import UpdateReadingProgress from "../UpdateReadingProgress";
import userEvent from "@testing-library/user-event";
import { buildBook } from "../../test/generate";
import { MockedProvider } from "@apollo/client/testing";
import { ADD_READING_PROGRESS_MUTATION } from "../../graphql/reading";
import { GOOGLE_BOOK_QUERY } from "../../graphql/books";
import { toast } from "react-toastify";

jest.mock("react-toastify");

const validBookId = "s1gVAAAAYAAJ";

afterEach(() => {
  cleanup();
});

test("<UpdateReadingProgress /> renders", async () => {
  const book = await buildBook();

  const mocks = [
    {
      request: {
        query: ADD_READING_PROGRESS_MUTATION,
        variables: { progress: 10, googleBooksId: book.googleBooksId },
      },
      result: {
        data: {
          createReading: {
            progress: 10,
          },
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
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <UpdateReadingProgress book={book} />
    </MockedProvider>
  );

  const button = screen.getByRole("button");

  expect(button).toHaveTextContent(/reading progress/i);

  userEvent.click(button);

  let form: HTMLElement;
  let input: HTMLElement;
  let submitButton: HTMLElement;

  await waitFor(() => {
    form = screen.getByRole("form");
    input = screen.getByLabelText(/currently on/i);
    submitButton = screen.getByRole("button", { name: /add progress/i });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(
      screen.getByText(`out of ${book.pageCount} pages`)
    ).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  expect(form).toHaveFormValues({
    progress: null,
  });

  await userEvent.type(input, "10");

  expect(form).toHaveFormValues({
    progress: 10,
  });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Reading progress added!");
  });
});
