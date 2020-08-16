import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import toast from "react-toastify";
import Button from "./styles/ButtonStyles";
import FormStyles, { InputGroup, ActionGroup } from "./styles/FormStyles";

type FormInputs = {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
};

const Signup = () => {
  const { register, errors, getValues, handleSubmit } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs): void => {
    console.log(data);
  };

  return (
    <FormStyles role="form" onSubmit={handleSubmit(onSubmit)}>
      <InputGroup>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Email"
          ref={register({
            required: true,
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
        />
        {errors?.email?.type === "required" && (
          <p className="error-message" data-testid="validation-error">
            This field is required.
          </p>
        )}
        {errors?.email?.type === "pattern" && (
          <p className="error-message" data-testid="validation-error">
            Must be valid email!
          </p>
        )}
      </InputGroup>
      <InputGroup>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          ref={register({ required: true })}
        />
        {errors?.username?.type === "required" && (
          <p className="error-message" data-testid="validation-error">
            This field is required.
          </p>
        )}
      </InputGroup>
      <InputGroup>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          ref={register({ required: true })}
        />
        {errors?.password?.type === "required" && (
          <p className="error-message" data-testid="validation-error">
            This field is required.
          </p>
        )}
      </InputGroup>
      <InputGroup>
        <label htmlFor="confirm_password">Confirm Password</label>
        <input
          type="password"
          id="confirm_password"
          name="confirm_password"
          placeholder="Confirm Password"
          ref={register({
            required: true,
            validate: (value) => {
              const values = getValues();
              return values.password === value;
            },
          })}
        />
        {errors?.confirm_password?.type === "required" && (
          <p className="error-message" data-testid="validation-error">
            This field is required.
          </p>
        )}
        {errors?.confirm_password?.type === "validate" && (
          <p className="error-message" data-testid="validation-error">
            Passwords must match!
          </p>
        )}
      </InputGroup>
      <ActionGroup>
        <Button themeColor="red">Create account</Button>
      </ActionGroup>
    </FormStyles>
  );
};

export default Signup;
