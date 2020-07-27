import React from "react";
import { useForm } from "react-hook-form";
import StyledForm, { InputGroup, ActionGroup } from "./styles/FormStyles";
import Link from "next/link";

interface FormInputs {
  Email: string;
  Password: string;
}

const Signin = () => {
  const { register, handleSubmit, errors, formState } = useForm<FormInputs>();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <InputGroup>
        <label htmlFor="Email">Email</label>
        <input
          type="text"
          placeholder="Email"
          name="Email"
          ref={register({ required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.Email?.type === "required" && (
          <p className="error-message">Email is required</p>
        )}
        {errors.Email?.type === "pattern" && (
          <p className="error-message">Email must be an email</p>
        )}
      </InputGroup>

      <InputGroup className="last">
        <label htmlFor="Password">Password</label>
        <input
          type="password"
          placeholder="Password"
          name="Password"
          ref={register({ required: true })}
        />
        {errors.Password && (
          <p className="error-message">Password is required</p>
        )}
      </InputGroup>
      <ActionGroup>
        <button type="submit">Sign{formState.isSubmitting && "ing"} In</button>
        <Link href="/forgot">
          <a>Forgot Password?</a>
        </Link>
      </ActionGroup>
    </StyledForm>
  );
};

export default Signin;
