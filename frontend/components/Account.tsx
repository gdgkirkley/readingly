import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import {
  User,
  UPDATE_USER_MUTATION,
  CURRENT_USER_QUERY,
} from "../graphql/user";
import FormStyles, { InputGroup, ActionGroup } from "./styles/FormStyles";
import Button from "./styles/ButtonStyles";
import { toast } from "react-toastify";

const InformationContainer = styled.div`
  padding: 1rem;
`;

const InfoBox = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;

  &:nth-of-type(1n) {
    border-bottom: 1px dotted ${(props) => props.theme.black};
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

const InfoHeader = styled.div`
  font-weight: 600;
  font-size: 1.7rem;
`;

const UpdateInfoForm = styled(FormStyles)`
  border: none;
  box-shadow: none;
  width: 100%;
  max-width: 100%;
  padding: 0;
`;

type Props = {
  me: User;
};

type FormInputs = {
  email: string;
  username: string;
};

const Account: React.FC<Props> = ({ me }) => {
  const [edit, setEdit] = useState(false);

  const [updateUser, { loading, error }] = useMutation(UPDATE_USER_MUTATION, {
    onError: (error) => {
      toast.error(`Unable to update: ${error.message}`);
    },
  });

  const { register, handleSubmit, errors, reset } = useForm<FormInputs>({
    defaultValues: {
      email: me.email,
      username: me.username,
    },
  });

  const onSubmit = async (data: FormInputs) => {
    await updateUser({
      variables: {
        id: me.id,
        ...data,
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
      awaitRefetchQueries: true,
    });

    if (!error && !loading) {
      toast.success("Your information has been updated!");
      setEdit(false);
      reset({ ...data });
    }
  };

  const toggleEdit = (e) => {
    e.preventDefault();
    setEdit(!edit);
  };

  return (
    <>
      {!edit ? (
        <InformationContainer>
          <InfoBox>
            <InfoHeader>Email</InfoHeader>
            <div>{me.email}</div>
          </InfoBox>
          <InfoBox>
            <InfoHeader>Username</InfoHeader>
            <div>{me.username}</div>
          </InfoBox>
          <Button themeColor="yellow" onClick={toggleEdit}>
            Edit Your Info
          </Button>
        </InformationContainer>
      ) : (
        <UpdateInfoForm aria-label="form" onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              ref={register({ pattern: /^\S+@\S+$/i })}
              autoFocus
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="username">Username</label>
            <input
              type="username"
              name="username"
              id="username"
              ref={register}
            />
          </InputGroup>
          <ActionGroup>
            <Button themeColor="black" onClick={toggleEdit}>
              Cancel
            </Button>
            <Button themeColor="purple">Update account</Button>
          </ActionGroup>
        </UpdateInfoForm>
      )}
    </>
  );
};

export default Account;
