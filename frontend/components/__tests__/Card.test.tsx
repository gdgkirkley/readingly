import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import Card from "../Card";

afterEach(() => {
  cleanup();
});

test("<Card /> renders", () => {
  render(<Card title="Test" />);

  expect(screen.getByRole("heading")).toHaveTextContent(/test/i);
});
