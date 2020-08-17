import React from "react";
import { render, cleanup, screen, waitFor, act } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import ResetPassword from "../ResetPassword";
import { buildUser } from "../../test/generate";
import userEvent from "@testing-library/user-event";
import { RESET_PASSWORD_MUTATION } from "../../graphql/user";
import { toast } from "react-toastify";

jest.mock("react-toastify");

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

test("<ResetPassword /> renders a reser password form", async () => {
  const user = await buildUser();

  const mocks = [
    {
      request: {
        query: RESET_PASSWORD_MUTATION,
        variables: {
          login: user.username,
          oldPassword: "test123",
          newPassword: "123test",
        },
      },
      result: {
        data: {
          id: user.id,
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ResetPassword me={user} />
    </MockedProvider>
  );

  const form = screen.getByRole("form");
  const oldPassword = screen.getByLabelText(/old password/i);
  const newPassword = screen.getAllByLabelText(/new password/i)[0];
  const confirmNewPassword = screen.getByLabelText(/confirm new password/i);
  const resetPasswordButton = screen.getByRole("button", {
    name: /update password/i,
  });

  expect(form).toHaveFormValues({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  act(() => {
    userEvent.click(resetPasswordButton);
  });

  let errors = await screen.findAllByTestId("validation-error");

  expect(errors).toHaveLength(3);
  expect(errors[0]).toHaveTextContent(/required field/i);
  expect(errors[1]).toHaveTextContent(/required field/i);
  expect(errors[2]).toHaveTextContent(/required field/i);

  await act(async () => {
    await userEvent.type(oldPassword, "test123");
    await userEvent.type(newPassword, "123test");
    await userEvent.type(confirmNewPassword, "123t");
  });

  errors = await screen.findAllByTestId("validation-error");

  expect(errors).toHaveLength(1);
  expect(errors[0]).toHaveTextContent(/new passwords must match/i);

  await act(async () => {
    userEvent.clear(confirmNewPassword);
    await userEvent.type(confirmNewPassword, "123test");
  });

  errors = screen.queryAllByTestId("validation-error");

  expect(errors).toHaveLength(0);

  act(() => {
    userEvent.click(resetPasswordButton);
  });

  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.error).not.toHaveBeenCalled();
  });
});

test("<ResetPassword /> handles error", async () => {
  const user = await buildUser();

  const mocks = [
    {
      request: {
        query: RESET_PASSWORD_MUTATION,
        variables: {
          login: user.username,
          oldPassword: "test123",
          newPassword: "123test",
        },
      },
      error: new Error("Bad request"),
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ResetPassword me={user} />
    </MockedProvider>
  );

  const form = screen.getByRole("form");
  const oldPassword = screen.getByLabelText(/old password/i);
  const newPassword = screen.getAllByLabelText(/new password/i)[0];
  const confirmNewPassword = screen.getByLabelText(/confirm new password/i);
  const resetPasswordButton = screen.getByRole("button", {
    name: /update password/i,
  });

  await act(async () => {
    await userEvent.type(oldPassword, "test123");
    await userEvent.type(newPassword, "123test");
    await userEvent.type(confirmNewPassword, "123test");
    userEvent.click(resetPasswordButton);
  });

  await waitFor(() => {
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledTimes(1);
  });
});
