import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import Dialog from "../Dialog";
import userEvent from "@testing-library/user-event";

const toggleModal = jest.fn();

afterEach(() => {
  cleanup();
});

test("<Dialog /> does not render if not open", () => {
  render(
    <Dialog
      open={false}
      toggleModal={toggleModal}
      accessibilityLabel="Dialog"
      role="dialog"
    />
  );

  expect(screen.queryByRole("dialog")).toBeFalsy();
});

test("<Dialog /> renders", () => {
  render(
    <Dialog
      open={true}
      toggleModal={toggleModal}
      accessibilityLabel="Dialog"
      role="dialog"
    />
  );

  const dialog = screen.getByRole("dialog");

  expect(dialog).toBeInTheDocument();

  const closeButton = screen.getByRole("button", { name: /close/i });

  expect(closeButton).toBeInTheDocument();

  userEvent.click(closeButton);

  expect(toggleModal).toHaveBeenCalledTimes(1);
});

test("<Dialog /> renders with content", () => {
  render(
    <Dialog
      open={true}
      toggleModal={toggleModal}
      accessibilityLabel="Dialog"
      role="dialog"
    >
      <h1>A heading</h1>
    </Dialog>
  );

  expect(screen.getByRole("heading")).toBeInTheDocument();
  expect(screen.getByRole("heading")).toHaveTextContent("A heading");
});
