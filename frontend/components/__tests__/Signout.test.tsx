import React from "react";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import Signout from "../Signout";
import { CURRENT_USER_QUERY, SIGN_OUT_USER_MUTATION } from "../../graphql/user";
import { buildUser } from "../../test/generate";
import { toast } from "react-toastify";

jest.mock("react-toastify");
jest.mock("next/link", () => "a");

afterEach(() => {
  cleanup();
});

test("<Signout /> renders", () => {
  render(
    <MockedProvider>
      <Signout />
    </MockedProvider>
  );

  expect(screen.getByRole("link")).toHaveTextContent(/sign out/i);
});

test("<Signout /> signs out the user", async () => {
  let signOutMutationCalled = false;

  const mocks = [
    {
      request: {
        query: SIGN_OUT_USER_MUTATION,
        variables: {},
      },
      result: () => {
        signOutMutationCalled = true;
        return {
          data: {
            signOut: { message: "Goodbye!" },
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
          me: null,
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Signout />
    </MockedProvider>
  );

  const button = screen.getByText(/sign out/i);

  userEvent.click(button);

  await waitFor(() => {
    expect(signOutMutationCalled).toBeTruthy();
    expect(toast.success).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Goodbye!");
  });
});

test("<Signout /> handles error", async () => {
  const mocks = [
    {
      request: {
        query: SIGN_OUT_USER_MUTATION,
        variables: {},
      },
      error: new Error("BAD SIGN OUT"),
    },
    {
      request: {
        query: CURRENT_USER_QUERY,
      },
      result: {
        data: {
          me: null,
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Signout />
    </MockedProvider>
  );

  const button = screen.getByText(/sign out/i);

  userEvent.click(button);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(
      "There was a problem signing out! Please try again."
    );
  });
});
