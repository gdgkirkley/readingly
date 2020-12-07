import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import GoalDisplay from "./index";
import { buildGoal, buildBook } from "../../../test/generate";
import { GoalStatus } from "../../../graphql/goal";

afterAll(() => {
  cleanup();
});

test("<GoalDisplay /> renders", async () => {
  const goal = await buildGoal();
  const book = await buildBook();

  render(<GoalDisplay goal={goal} title={book.title} />);

  expect(screen.getByTestId("goalDate")).toBeInTheDocument();
  expect(screen.getByTestId("readingRecommendation")).toBeInTheDocument();
  expect(screen.getByTestId("startDate")).toBeInTheDocument();
});

test("<GoalDisplay /> doesn't display reading recommendation if status is not in progress", async () => {
  const goal = await buildGoal({ status: GoalStatus.NotStarted });
  const book = await buildBook();

  render(<GoalDisplay goal={goal} title={book.title} />);

  expect(screen.getByTestId("goalDate")).toBeInTheDocument();
  expect(screen.queryByTestId("readingRecommendation")).not.toBeInTheDocument();
  expect(screen.getByTestId("startDate")).toBeInTheDocument();
});

test("<GoalDisplay /> doesn't display start date if none", async () => {
  const goal = await buildGoal({ startDate: null });
  const book = await buildBook();

  render(<GoalDisplay goal={goal} title={book.title} />);

  expect(screen.getByTestId("goalDate")).toBeInTheDocument();
  expect(screen.queryByTestId("readingRecommendation")).toBeInTheDocument();
  expect(screen.queryByTestId("startDate")).not.toBeInTheDocument();
});
