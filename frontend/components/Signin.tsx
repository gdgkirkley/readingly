import React from "react";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import StyledForm, { InputGroup, ActionGroup } from "./styles/FormStyles";
import { SIGN_IN_USER_MUTATION, CURRENT_USER_QUERY } from "../graphql/user";

interface FormInputs {
  email: string;
  password: string;
}

const Signin = () => {
  const [signIn, { data, error, loading }] = useMutation(SIGN_IN_USER_MUTATION);
  const { register, handleSubmit, errors, formState } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    signIn({
      variables: {
        login: data.email,
        password: data.password,
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
      awaitRefetchQueries: true,
    });
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <InputGroup>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Email"
          name="email"
          id="email"
          ref={register({ required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email?.type === "required" && (
          <p className="error-message" data-testid="validation-error">
            Email is required
          </p>
        )}
        {errors.email?.type === "pattern" && (
          <p className="error-message" data-testid="validation-error">
            Email must be an email
          </p>
        )}
      </InputGroup>

      <InputGroup className="last">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          id="password"
          ref={register({ required: true })}
        />
        {errors.password && (
          <p className="error-message" data-testid="validation-error">
            Password is required
          </p>
        )}
      </InputGroup>
      <ActionGroup>
        <button type="submit">Sign{loading && "ing"} In</button>
        <Link href="/forgot">
          <a>Forgot Password?</a>
        </Link>
      </ActionGroup>
    </StyledForm>
  );
};

export default Signin;
