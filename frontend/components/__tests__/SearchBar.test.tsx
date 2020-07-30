import React from "react";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import SearchBar from "../SearchBar";
import userEvent from "@testing-library/user-event";

afterEach(() => {
  cleanup();
});

test("<SearchBar /> renders a search input", async () => {
  const handleSearch = jest.fn();

  render(<SearchBar handleSearch={handleSearch} />);

  const searchInput = screen.getByLabelText(/search/i);

  expect(searchInput).toBeInTheDocument();

  userEvent.type(searchInput, "Pride and Prejudice");

  expect(screen.getByRole("form")).toHaveFormValues({
    search: "Pride and Prejudice",
  });

  userEvent.click(screen.getByRole("button"));

  await waitFor(() => {
    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith({
      search: "Pride and Prejudice",
    });
  });
});

test("<SearchBar /> accepts default value", async () => {
  const defaultValue = "Pride and Prejudice";
  const handleSearch = jest.fn();

  render(<SearchBar handleSearch={handleSearch} defaultValue={defaultValue} />);

  // We have to wait for refresh after the react-hook-form reset function is
  // called
  await waitFor(() => {
    expect(screen.getByRole("form")).toHaveFormValues({
      search: defaultValue,
    });
  });
});
