import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockRouter, { mockRouter } from "../../test/mockRouter";
import Signup from "../Signup";
import { SIGN_UP_USER_MUTATION, CURRENT_USER_QUERY } from "../../graphql/user";
import { buildUser } from "../../test/generate";

afterEach(() => {
  cleanup();
});

test("<Signup /> renders a signup form", async () => {
  const user = await buildUser({ email: "test@test.com" });
  let signInMutationCalled = false;

  const mocks = [
    {
      request: {
        query: SIGN_UP_USER_MUTATION,
        variables: {
          username: user.username,
          email: user.email,
          password: "test123",
        },
      },
      result: () => {
        signInMutationCalled = true;
        return {
          data: {
            signIn: { id: user.id },
          },
        };
      },
    },
    {
      request: {
        query: CURRENT_USER_QUERY,
      },
      result: {
        data: {
          me: { id: user.id, email: user.email, username: user.username },
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MockRouter>
        <Signup />
      </MockRouter>
    </MockedProvider>
  );

  const email = screen.getByLabelText(/email/i);
  const username = screen.getByLabelText(/username/i);
  const password = screen.getAllByLabelText(/password/i)[0];
  const confirmPassword = screen.getAllByLabelText(/password/i)[1];

  const button = screen.getByRole("button");

  expect(button).toHaveTextContent(/create account/i);

  act(() => {
    userEvent.click(button);
  });

  // Refetch all the errors every time.
  let errors = await screen.findAllByTestId("validation-error");

  expect(errors[0]).toHaveTextContent(/email is required/i);
  expect(errors[1]).toHaveTextContent(/username is required/i);
  expect(errors[2]).toHaveTextContent(/password is required/i);
  expect(errors[3]).toHaveTextContent(/must confirm password/i);

  await act(async () => {
    await userEvent.type(email, "test123");
  });

  errors = screen.getAllByTestId("validation-error");
  expect(errors[0]).toHaveTextContent(/must be valid email/i);
  expect(errors[1]).toHaveTextContent(/username is required/i);
  expect(errors[2]).toHaveTextContent(/password is required/i);
  expect(errors[3]).toHaveTextContent(/must confirm password/i);

  await act(async () => {
    userEvent.clear(email);
  });
  await userEvent.type(email, user.email);
  await userEvent.type(username, user.username);
  await userEvent.type(password, "test123");
  await userEvent.type(confirmPassword, "123test");

  errors = screen.getAllByTestId("validation-error");
  expect(errors[0]).toHaveTextContent(/passwords must match/i);

  await act(async () => {
    userEvent.clear(confirmPassword);
    await userEvent.type(confirmPassword, "test123");
  });

  expect(screen.queryAllByTestId("validation-error")).toHaveLength(0);

  act(() => {
    userEvent.click(button);
  });

  await waitFor(() => {
    expect(signInMutationCalled).toBe(true);
    expect(mockRouter.push).toHaveBeenCalledWith("/myaccount");
  });
});
