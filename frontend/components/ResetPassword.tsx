import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "styled-components";
import Button from "./styles/ButtonStyles";
import Form, { ActionGroup, InputGroup } from "./styles/FormStyles";
import { useForm } from "react-hook-form";
import { RESET_PASSWORD_MUTATION, User } from "../graphql/user";
import { toast } from "react-toastify";

const PasswordForm = styled(Form)`
  box-shadow: none;
  width: 100%;
  margin: 0;
  padding: 0;
`;

type Props = {
  me: User;
};

type FormInputs = {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
};

const ResetPassword = ({ me }: Props) => {
  const [resetPassword, { error, loading }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      onError: (error) => {
        toast.error(`${error.message}`);
      },
    }
  );
  const { register, handleSubmit, errors, getValues } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    await resetPassword({
      variables: {
        login: me.username,
        oldPassword: data.old_password,
        newPassword: data.new_password,
      },
    });

    if (!loading && !error) {
      toast.success(`Password updated successfully!`);
    }
  };

  return (
    <PasswordForm role="form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Reset Password</h2>
      <InputGroup>
        <label htmlFor="password">Old Password</label>
        <input
          id="old_password"
          name="old_password"
          type="password"
          ref={register({ required: true })}
        />
        {errors.old_password?.type === "required" && (
          <p className="error-message" data-testid="validation-error">
            This is a required field.
          </p>
        )}
      </InputGroup>
      <InputGroup>
        <label htmlFor="new_password">New Password</label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          ref={register({ required: true })}
        />
        {errors.new_password?.type === "required" && (
          <p className="error-message" data-testid="validation-error">
            This is a required field.
          </p>
        )}
      </InputGroup>
      <InputGroup>
        <label htmlFor="confirm_new_password">Confirm New Password</label>
        <input
          id="confirm_new_password"
          name="confirm_new_password"
          type="password"
          ref={register({
            required: true,
            validate: (value) => {
              const password = getValues();
              return value === password.new_password;
            },
          })}
        />
        {errors.confirm_new_password?.type === "required" && (
          <p className="error-message" data-testid="validation-error">
            This is a required field.
          </p>
        )}
        {errors.confirm_new_password?.type === "validate" && (
          <p className="error-message" data-testid="validation-error">
            New passwords must match
          </p>
        )}
      </InputGroup>
      <ActionGroup>
        <Button themeColor="purple" disabled={loading}>
          Updat{loading ? "ing" : "e"} Password
        </Button>
      </ActionGroup>
    </PasswordForm>
  );
};

export default ResetPassword;
