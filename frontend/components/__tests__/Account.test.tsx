import React from "react";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import Account from "../Account";
import { buildUser } from "../../test/generate";

afterEach(() => {
  cleanup();
});

test("<Account /> displays user information and renders a usable form", async () => {
  const user = await buildUser();

  render(
    <MockedProvider>
      <Account me={user} />
    </MockedProvider>
  );

  expect(screen.getByText(user.email)).toBeInTheDocument();
  expect(screen.getByText(user.username)).toBeInTheDocument();

  const editInfoButton = screen.getByRole("button");

  userEvent.click(editInfoButton);

  const form = await screen.findByRole("form");
  const email = screen.getByLabelText(/email/i);
  const username = screen.getByLabelText(/username/i);

  expect(form).toHaveFormValues({
    email: user.email,
    username: user.username,
  });

  userEvent.clear(email);
  userEvent.clear(username);
  await userEvent.type(email, "test123");
  await userEvent.type(username, "acooluser");

  expect(form).toHaveFormValues({
    email: "test123",
    username: "acooluser",
  });
});
