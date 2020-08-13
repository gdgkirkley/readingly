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

  userEvent.tab();

  expect(closeButton).toHaveFocus();

  userEvent.click(closeButton);

  expect(toggleModal).toHaveBeenCalledTimes(1);
});

test("<Dialog /> renders with accessible content", () => {
  render(
    <Dialog
      open={true}
      toggleModal={toggleModal}
      accessibilityLabel="Dialog"
      role="dialog"
    >
      <h1>A heading</h1>
      <label htmlFor="test">A Test Input</label>
      <input id="test" name="test" type="text" />
      <button>Submit</button>
    </Dialog>
  );

  const closeButton = screen.getByRole("button", { name: /close/i });
  const heading = screen.getByRole("heading");
  const input = screen.getByLabelText(/test/i);
  const button = screen.getByRole("button", { name: "Submit" });

  const modalRoot = document.querySelector("#modal-root");

  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent("A heading");

  userEvent.tab({ focusTrap: modalRoot });

  expect(closeButton).toHaveFocus();

  userEvent.tab({ focusTrap: modalRoot });

  expect(input).toHaveFocus();

  userEvent.tab({ focusTrap: modalRoot });

  expect(button).toHaveFocus();

  userEvent.tab({ focusTrap: modalRoot });

  expect(closeButton).toHaveFocus();

  userEvent.tab({ shift: true, focusTrap: modalRoot });

  expect(button).toHaveFocus();
});
