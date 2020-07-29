import React from "react";
import { useForm } from "react-hook-form";
import { User } from "../graphql/user";
import FormStyles, { InputGroup, ActionGroup } from "./styles/FormStyles";

type Props = {
  me: User;
};

type FormInputs = {
  email: string;
  username: string;
};

const Account = ({ me }: Props) => {
  const { register, handleSubmit, errors } = useForm<FormInputs>({
    defaultValues: {
      email: me.email,
      username: me.username,
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <FormStyles aria-label="form" onSubmit={handleSubmit(onSubmit)}>
      <InputGroup>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          ref={register({ pattern: /^\S+@\S+$/i })}
        />
      </InputGroup>
      <InputGroup>
        <label htmlFor="username">Username</label>
        <input type="username" name="username" id="username" ref={register} />
      </InputGroup>
      <ActionGroup>
        <button type="submit">Update account</button>
      </ActionGroup>
    </FormStyles>
  );
};

export default Account;
