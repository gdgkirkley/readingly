import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import CreateGoal from "../CreateGoal";
import { CREATE_GOAL_MUTATION, GoalType } from "../../graphql/goal";
import { GOOGLE_BOOK_QUERY } from "../../graphql/books";
import { buildBook, buildGoal } from "../../test/generate";
import { parseStringDateISO } from "../../lib/formatDates";

jest.mock("react-toastify");

afterEach(() => {
  cleanup();
});

test("<CreateGoal /> renders", async () => {
  const book = await buildBook();
  const today = new Date();
  const todayString = today.toISOString().slice(0, 10);
  let createGoalMutationCalled = false;

  const goal = await buildGoal({ goalDate: todayString });

  const mocks = [
    {
      request: {
        query: CREATE_GOAL_MUTATION,
        variables: {
          goalDate: parseStringDateISO(todayString),
          goalableId: book.googleBooksId,
        },
      },
      result: () => {
        createGoalMutationCalled = true;
        return {
          data: {
            createGoal: {
              id: goal.id,
              goalDate: goal.goalDate,
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
      <CreateGoal
        goalableId={book.googleBooksId}
        goalableType={GoalType.Book}
      />
    </MockedProvider>
  );

  const createButton = screen.getByRole("button");

  expect(createButton).toBeInTheDocument();

  userEvent.click(createButton);

  let form: HTMLElement;
  let goalDateInput: HTMLElement;
  let startDateInput: HTMLElement;
  let statusSelect: HTMLElement;
  let submitButton: HTMLElement;

  await waitFor(() => {
    form = screen.getByRole("form");
    goalDateInput = screen.getByLabelText(/finish/i);
    startDateInput = screen.getByLabelText(/start/i);
    statusSelect = screen.getByLabelText(/status/i);
    submitButton = screen.getByRole("button", { name: /create/i });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(goalDateInput).toBeInTheDocument();
    expect(startDateInput).toBeInTheDocument();
    expect(statusSelect).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  userEvent.type(goalDateInput, today.toISOString());

  expect(form).toHaveFormValues({
    goalDate: today.toISOString().slice(0, 10),
  });

  // userEvent.click(submitButton);

  // await waitFor(() => {
  //   expect(toast.error).not.toHaveBeenCalled();
  //   expect(createGoalMutationCalled).toBeTruthy();
  //   expect(toast.success).toHaveBeenCalledTimes(1);
  //   expect(toast.success).toHaveBeenCalledWith(`Goal created!`);
  // });
});
