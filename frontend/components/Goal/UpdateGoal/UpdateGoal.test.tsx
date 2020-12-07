import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import UpdateGoal from "./index";
import { buildBook, buildGoal } from "../../../test/generate";
import { formatDate } from "../../../lib/formatDates";
import { GoalType, UPDATE_GOAL_MUTATION } from "../../../graphql/goal";
import { GOOGLE_BOOK_QUERY } from "../../../graphql/books";

jest.mock("react-toastify");

afterEach(() => {
  cleanup();
});

test("<UpdateGoal /> renders", async () => {
  const book = await buildBook();
  const today = new Date();
  const todayString = today.toISOString().slice(0, 10);
  const newDate = "2021-06-30";
  let updateMutationCalled = false;

  const goal = await buildGoal({
    goalableId: book.googleBooksId,
    goalableType: GoalType.Book,
    goalDate: todayString,
  });

  const mocks = [
    {
      request: {
        query: UPDATE_GOAL_MUTATION,
        variables: {
          startDate: todayString,
          endDate: newDate,
          goalDate: newDate,
          id: goal.id,
        },
      },
      result: () => {
        updateMutationCalled = true;
        return {
          data: {
            createGoal: {
              id: goal.id,
              goalDate: newDate,
              goalableType: goal.goalableType,
            },
          },
        };
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
            publisher: book.publisher,
            categories: book.categories,
            averageRating: book.averageRating,
            googleBooksId: book.googleBooksId,
            averageTimeToReadInSeconds: book.averageTimeToReadInSeconds,
            reading: book.reading,
            bookshelves: book.bookshelves,
            goal: book.goal,
          },
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <UpdateGoal goal={goal} />
    </MockedProvider>
  );

  const updateButton = screen.getByRole("button");

  expect(updateButton).toBeInTheDocument();

  userEvent.click(updateButton);

  let form: HTMLElement;
  let goalDateInput: HTMLElement;
  let startDateInput: HTMLElement;
  let statusSelect: HTMLElement;
  let endDateInput: HTMLElement;
  let submitButton: HTMLElement;

  await waitFor(() => {
    form = screen.getByRole("form");
    goalDateInput = screen.getByLabelText(/finish/i);
    startDateInput = screen.getByLabelText(/start/i);
    statusSelect = screen.getByLabelText(/status/i);
    endDateInput = screen.getByLabelText(/complete/i);
    submitButton = screen.getByRole("button", { name: /update/i });

    expect(form).toBeInTheDocument();
    expect(goalDateInput).toBeInTheDocument();
    expect(startDateInput).toBeInTheDocument();
    expect(statusSelect).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  userEvent.clear(goalDateInput);

  expect(form).toHaveFormValues({
    goalDate: "",
    startDate: "",
    status: goal.status,
    endDate: "",
  });

  userEvent.type(goalDateInput, newDate);
  userEvent.type(startDateInput, todayString);
  userEvent.type(endDateInput, newDate);

  expect(form).toHaveFormValues({
    goalDate: newDate,
    startDate: newDate,
    endDate: newDate,
  });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(toast.error).not.toHaveBeenCalled();
    expect(updateMutationCalled).toBeTruthy();
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(
      `Goal updated to ${formatDate(newDate)}!`
    );
  });
});
