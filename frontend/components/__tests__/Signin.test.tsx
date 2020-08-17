import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockRouter, { mockRouter } from "../../test/mockRouter";
import Signin from "../Signin";
import { SIGN_IN_USER_MUTATION, CURRENT_USER_QUERY } from "../../graphql/user";
import { buildUser } from "../../test/generate";
import { toast } from "react-toastify";

jest.mock("react-toastify");

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

test("<Signin /> renders a signin form", async () => {
  const user = await buildUser();
  let signInMutationCalled = false;

  const mocks = [
    {
      request: {
        query: SIGN_IN_USER_MUTATION,
        variables: { login: user.email, password: "test123" },
      },
      result: () => {
        signInMutationCalled = true;
        return {
          data: {
            signIn: { id: user.id, email: user.email, username: user.username },
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
        <Signin />
      </MockRouter>
    </MockedProvider>
  );

  const email = screen.getByLabelText(/email/i);
  const password = screen.getByLabelText(/password/i);

  const button = screen.getByRole("button");

  expect(button).toHaveTextContent(/sign in/i);
  expect(screen.getByRole("link")).toHaveTextContent(/forgot password/i);

  act(() => {
    userEvent.click(button);
  });

  let errors = await screen.findAllByTestId("validation-error");
  expect(errors[0]).toHaveTextContent(/email is required/i);
  expect(errors[1]).toHaveTextContent(/password is required/i);

  await act(async () => {
    await userEvent.type(email, "test123");
  });

  errors = screen.getAllByTestId("validation-error");
  expect(errors[0]).toHaveTextContent(/must be an email/i);
  expect(errors[1]).toHaveTextContent(/password is required/i);

  await act(async () => {
    userEvent.clear(email);
    await userEvent.type(email, user.email);
    await userEvent.type(password, "test123");
  });

  expect(screen.queryAllByTestId("validation-error")).toHaveLength(0);

  act(() => {
    userEvent.click(button);
  });

  await waitFor(() => {
    expect(signInMutationCalled).toBe(true);
    expect(mockRouter.push).toHaveBeenCalledWith("/");
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.error).not.toHaveBeenCalled();
  });
});

test("<Signin /> handles error", async () => {
  const errorMessage = "Bad request";
  const user = await buildUser();

  const mocks = [
    {
      request: {
        query: SIGN_IN_USER_MUTATION,
        variables: { login: user.email, password: "test123" },
      },
      error: new Error(errorMessage),
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
        <Signin />
      </MockRouter>
    </MockedProvider>
  );

  const email = screen.getByLabelText(/email/i);
  const password = screen.getByLabelText(/password/i);

  const button = screen.getByRole("button");

  await act(async () => {
    await userEvent.type(email, user.email);
    await userEvent.type(password, "test123");
  });

  expect(screen.queryAllByTestId("validation-error")).toHaveLength(0);

  act(() => {
    userEvent.click(button);
  });

  await waitFor(() => {
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });
});
