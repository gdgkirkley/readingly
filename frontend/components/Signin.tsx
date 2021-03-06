import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import StyledForm, { InputGroup, ActionGroup } from "./styles/FormStyles";
import Button from "./styles/ButtonStyles";
import { SIGN_IN_USER_MUTATION, CURRENT_USER_QUERY } from "../graphql/user";
import { toast } from "react-toastify";

type FormInputs = {
  email: string;
  password: string;
};

const Signin = () => {
  const router = useRouter();
  const [signIn, { error, loading }] = useMutation(SIGN_IN_USER_MUTATION, {
    onCompleted: () => {
      router.push("/");
      toast.success("Welcome back!");
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
  const { register, handleSubmit, errors } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    await signIn({
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
          ref={register({
            required: true,
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          autoFocus
        />
        {errors.email?.type === "required" && (
          <p className="error-message" data-testid="validation-error">
            Email is required
          </p>
        )}
        {errors.email?.type === "pattern" && (
          <p className="error-message" data-testid="validation-error">
            Must be an email
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
        <Button themeColor="red">Sign{loading && "ing"} In</Button>
        <Link href="/forgot">
          <a>Forgot Password?</a>
        </Link>
      </ActionGroup>
    </StyledForm>
  );
};

export default Signin;
