import React from "react";
import { render, cleanup, screen, waitFor, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { toast } from "react-toastify";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import Account from "../Account";
import { UPDATE_USER_MUTATION } from "../../graphql/user";
import { buildUser } from "../../test/generate";
import { mockCurrentUserQuery } from "../../test/mocks";

jest.mock("react-toastify");

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

test("<Account /> displays user information and renders a usable form", async () => {
  let updateUserQueryCalled = false;
  const user = await buildUser();
  const newEmail = "test123@test.com";
  const newUsername = "acooluser";

  const mockedCurrentUser = await mockCurrentUserQuery({ user });

  const mocks = [
    {
      request: {
        query: UPDATE_USER_MUTATION,
        variables: { id: user.id, username: newUsername, email: newEmail },
      },
      result: () => {
        updateUserQueryCalled = true;
        return {
          data: {
            id: user.id,
          },
        };
      },
    },
    mockedCurrentUser,
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
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
  const updateButton = screen.getByRole("button", { name: /update/i });

  expect(form).toHaveFormValues({
    email: user.email,
    username: user.username,
  });

  userEvent.clear(email);
  userEvent.clear(username);
  await userEvent.type(email, newEmail);
  await userEvent.type(username, newUsername);

  expect(form).toHaveFormValues({
    email: newEmail,
    username: newUsername,
  });

  act(() => {
    userEvent.click(updateButton);
  });

  await waitFor(() => {
    expect(updateUserQueryCalled).toBeTruthy();
    expect(toast.success).toHaveBeenCalledTimes(1);
  });
});

test("<Account /> is accessible", async () => {
  const user = await buildUser();

  const { container } = render(
    <MockedProvider>
      <Account me={user} />
    </MockedProvider>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
