import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import ReadingCard from "../ReadingCard";
import { buildReading, buildBook } from "../../test/generate";
import { formatDate } from "../../lib/formatDates";
import { DELETE_READING_PROGRESS_MUTATION } from "../../graphql/reading";
import { GOOGLE_BOOK_QUERY } from "../../graphql/books";
import userEvent from "@testing-library/user-event";

jest.mock("react-toastify");

afterEach(() => {
  cleanup();
});

test("<ReadingCard /> renders", async () => {
  const today = new Date();
  const oneHourSeconds = 60 * 60;
  const reading = await buildReading({
    createdAt: today,
    timeRemainingInSeconds: oneHourSeconds,
  });
  const book = await buildBook();

  const mocks = [
    {
      request: {
        query: DELETE_READING_PROGRESS_MUTATION,
        variables: { id: reading.id },
      },
      result: {
        data: {
          message: "Reading progress deleted",
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
          googleBook: book,
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ReadingCard reading={reading} googleBooksId={book.googleBooksId} />
    </MockedProvider>
  );

  const removeButton = screen.getByRole("button");

  expect(screen.getByRole("heading")).toHaveTextContent(
    `On page ${reading.progress}`
  );
  expect(screen.getByText("1 hour to go")).toBeInTheDocument();
  expect(removeButton).toBeInTheDocument();

  userEvent.click(removeButton);

  let dialog: HTMLElement;

  await waitFor(() => {
    dialog = screen.getByRole("dialog");

    expect(dialog).toBeInTheDocument();
  });

  const confirmButton = screen.getByRole("button", { name: /confirm/i });

  userEvent.click(confirmButton);

  await waitFor(() => {
    expect(toast.success).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Reading progress deleted!");
  });
});
