import React, { useState } from "react";
import styled from "styled-components";
import Button from "./styles/ButtonStyles";
import Dialog, { InnerDialogContent } from "./Dialog";
import Form, { ActionGroup, InputGroup } from "./styles/FormStyles";
import { useForm } from "react-hook-form";

const PasswordForm = styled(Form)`
  box-shadow: none;
  width: 100%;
  margin: 0;
  padding: 0;
`;

const ResetPassword = () => {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <PasswordForm role="form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Reset Password</h2>
      <InputGroup>
        <label htmlFor="password">Old Password</label>
        <input id="password" name="password" type="password" ref={register} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="new_password">New Password</label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          ref={register}
        />
      </InputGroup>
      <InputGroup>
        <label htmlFor="confirm_new_password">Confirm New Password</label>
        <input
          id="confirm_new_password"
          name="confirm_new_password"
          type="password"
          ref={register}
        />
      </InputGroup>
      <ActionGroup>
        <Button themeColor="purple">Update Password</Button>
      </ActionGroup>
    </PasswordForm>
  );
};

export default ResetPassword;
