import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import Footer from "../Footer";

afterEach(() => {
  cleanup();
});

test("<Footer /> renders a footer components", () => {
  render(<Footer />);

  expect(screen.queryByText("Readingly")).toBeTruthy();
});
