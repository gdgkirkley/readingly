import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import BookImagePlaceholder from "../BookImagePlaceholder";

afterEach(() => {
  cleanup();
});

test("<BookImagePlaceholder /> renders", () => {
  render(<BookImagePlaceholder />);

  const placeholder = screen.getByTestId("book-image-placeholder");

  expect(placeholder).toBeInTheDocument();
  expect(placeholder).toBeVisible();
});
