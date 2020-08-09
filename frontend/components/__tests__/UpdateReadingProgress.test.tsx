import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import UpdateReadingProgress from "../UpdateReadingProgress";
import userEvent from "@testing-library/user-event";
import { buildBook } from "../../test/generate";
import { MockedProvider } from "@apollo/client/testing";

const validBookId = "s1gVAAAAYAAJ";

afterEach(() => {
  cleanup();
});

test("<UpdateReadingProgress /> renders", async () => {
  const book = await buildBook();
  render(
    <MockedProvider>
      <UpdateReadingProgress book={book} />
    </MockedProvider>
  );

  const button = screen.getByRole("button");

  expect(button).toHaveTextContent(/reading progress/i);

  userEvent.click(button);

  let form: HTMLElement;
  let input: HTMLElement;
  let submitButton: HTMLElement;

  await waitFor(() => {
    form = screen.getByRole("form");
    input = screen.getByLabelText(/currently on/i);
    submitButton = screen.getByRole("button", { name: /add progress/i });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(
      screen.getByText(`out of ${book.pageCount} pages`)
    ).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  expect(form).toHaveFormValues({
    progress: null,
  });

  await userEvent.type(input, "10");

  expect(form).toHaveFormValues({
    progress: 10,
  });
});
