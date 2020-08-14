import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { User } from "../graphql/user";
import FormStyles, { InputGroup, ActionGroup } from "./styles/FormStyles";
import Button from "./styles/ButtonStyles";
import ReadingIllustration from "./illustrations/Reading";

const AccountContainer = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

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

type Props = {
  me: User;
};

type FormInputs = {
  email: string;
  username: string;
};

const Account = ({ me }: Props) => {
  const [edit, setEdit] = useState(false);
  const { register, handleSubmit, errors } = useForm<FormInputs>({
    defaultValues: {
      email: me.email,
      username: me.username,
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const toggleEdit = (e) => {
    e.preventDefault();
    setEdit(!edit);
  };

  return (
    <AccountContainer>
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
        <FormStyles aria-label="form" onSubmit={handleSubmit(onSubmit)}>
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
        </FormStyles>
      )}
      <ReadingIllustration />
    </AccountContainer>
  );
};

export default Account;
