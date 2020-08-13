import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import ReadingCard from "../ReadingCard";
import { buildReading } from "../../test/generate";
import { formatDate } from "../../lib/formatDates";

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

  render(<ReadingCard reading={reading} />);

  expect(screen.getByRole("heading")).toHaveTextContent(formatDate(today));
  expect(screen.getByText(reading.progress.toString())).toBeInTheDocument();
  expect(screen.getByText("1 hour to go")).toBeInTheDocument();
});
