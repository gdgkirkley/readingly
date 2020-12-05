import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import Dialog from "./Dialog";
import Button from "./styles/ButtonStyles";
import FormStyles, { InputGroup, ActionGroup } from "./styles/FormStyles";
import { GoalType, CREATE_GOAL_MUTATION } from "../graphql/goal";
import { GOOGLE_BOOK_QUERY } from "../graphql/books";
import { MY_BOOKSHELF_QUERY } from "../graphql/bookshelves";
import { toast } from "react-toastify";
import { parseStringDateISO } from "../lib/formatDates";

const CreateGoalForm = styled(FormStyles)`
  box-shadow: none;
  width: 100%;
  margin: 0;
  padding: 0;
`;

type FormInputs = {
  goalDate: string;
};

type Props = {
  goalableType: GoalType;
  goalableId: string;
  bookshelfTitle?: string;
};

const CreateGoal = ({ goalableType, goalableId, bookshelfTitle }: Props) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm<FormInputs>();

  const [createGoal, { loading, error }] = useMutation(CREATE_GOAL_MUTATION, {
    onError: (error) => {
      toast.error(`There was an error creating goal: ${error.message}`);
    },
  });

  const toggle = () => setOpen(!open);

  const onSubmit = async (data: FormInputs) => {
    const refetchQuery =
      goalableType === GoalType.Book
        ? {
            query: GOOGLE_BOOK_QUERY,
            variables: { googleBooksId: goalableId },
          }
        : {
            query: MY_BOOKSHELF_QUERY,
            variables: { title: bookshelfTitle },
          };

    await createGoal({
      variables: {
        goalDate: parseStringDateISO(data.goalDate),
        goalableId: goalableId,
      },
      refetchQueries: [refetchQuery],
      awaitRefetchQueries: true,
    });

    if (!error && !loading) {
      toast.success("Goal created!");
      setOpen(false);
    }
  };

  return (
    <>
      <Button themeColor="red" onClick={toggle}>
        Add Goal
      </Button>
      <Dialog
        role="dialog"
        accessibilityLabel="Create a goal"
        toggleModal={toggle}
        open={open}
      >
        <div>
          <h1>Create a goal</h1>
          <CreateGoalForm role="form" onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <label htmlFor="goalDate">
                When would you like to finish by?
              </label>
              <input
                id="goalDate"
                name="goalDate"
                type="date"
                ref={register}
                autoFocus
              />
            </InputGroup>
            <ActionGroup justifyContent="center">
              <Button themeColor="red" type="submit" name="create">
                Create
              </Button>
            </ActionGroup>
          </CreateGoalForm>
        </div>
      </Dialog>
    </>
  );
};

export default CreateGoal;
