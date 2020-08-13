import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import ReadingCard from "../ReadingCard";
import { buildReading } from "../../test/generate";

afterEach(() => {
  cleanup();
});

test("<ReadingCard /> renders", async () => {
  const reading = await buildReading();
  render(<ReadingCard reading={reading} />);
});
