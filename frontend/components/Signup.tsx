import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import Button from "./styles/ButtonStyles";
import FormStyles, { InputGroup, ActionGroup } from "./styles/FormStyles";
import { SIGN_UP_USER_MUTATION, CURRENT_USER_QUERY } from "../graphql/user";

type FormInputs = {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
};

const Signup = () => {
  const router = useRouter();
  const [signUp, { loading, error }] = useMutation(SIGN_UP_USER_MUTATION, {
    onError: (error) => {
      toast.error(`Unable to sign up: ${error.message}`);
    },
  });

  const { register, errors, getValues, handleSubmit } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    await signUp({
      variables: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
      awaitRefetchQueries: true,
    });

    if (!loading && !error) {
      toast.success(`Welcome to Readingly!`);
      router.push("/myaccount");
    }
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
            Email is required.
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
            Username is required.
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
            Password is required.
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
            Must confirm password
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
