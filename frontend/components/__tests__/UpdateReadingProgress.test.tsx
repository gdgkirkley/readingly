import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import UpdateReadingProgress from "../UpdateReadingProgress";

afterEach(() => {
  cleanup();
});

test("<UpdateReadingProgress /> renders", () => {
  render(<UpdateReadingProgress />);

  expect(screen.getByRole("button")).toHaveTextContent(/reading progress/i);
});
