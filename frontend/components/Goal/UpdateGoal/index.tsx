import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Dialog from "../../Dialog";
import Button from "../../styles/ButtonStyles";
import FormStyles, { InputGroup, ActionGroup } from "../../styles/FormStyles";
import { Goal, GoalType, UPDATE_GOAL_MUTATION } from "../../../graphql/goal";
import { GOOGLE_BOOK_QUERY } from "../../../graphql/books";
import { MY_BOOKSHELF_QUERY } from "../../../graphql/bookshelves";
import { formatDate } from "../../../lib/formatDates";

const UpdateGoalForm = styled(FormStyles)`
  box-shadow: none;
  width: 100%;
  margin: 0;
  padding: 0;
`;

type FormInputs = {
  goalDate: string;
};

type Props = {
  goal: Goal;
  bookshelfTitle?: string;
};

const UpdateGoal = ({ goal, bookshelfTitle }: Props) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm<FormInputs>({
    defaultValues: {
      goalDate: goal.goalDate,
    },
  });

  const [updateGoal, { loading, error }] = useMutation(UPDATE_GOAL_MUTATION, {
    onError: (error) => {
      toast.error(`There was an error updating goal: ${error.message}`);
    },
  });

  const toggle = () => setOpen(!open);

  const onSubmit = async (data: FormInputs) => {
    // This can be improved by inserting the response goal into the
    // cached data
    const refetchQuery =
      goal.goalableType === GoalType.Book
        ? {
            query: GOOGLE_BOOK_QUERY,
            variables: { googleBooksId: goal.goalableId },
          }
        : {
            query: MY_BOOKSHELF_QUERY,
            variables: { title: bookshelfTitle },
          };

    await updateGoal({
      variables: {
        goalDate: data.goalDate,
        id: goal.id,
      },
      refetchQueries: [refetchQuery],
      awaitRefetchQueries: true,
    });

    if (!error && !loading) {
      toast.success(`Goal updated to ${formatDate(data.goalDate)}!`);
      setOpen(false);
    }
  };

  return (
    <>
      <Button themeColor="red" onClick={toggle}>
        Change Goal
      </Button>
      <Dialog
        role="dialog"
        accessibilityLabel="Create a goal"
        toggleModal={toggle}
        open={open}
      >
        <div>
          <h1>Update goal</h1>
          <UpdateGoalForm role="form" onSubmit={handleSubmit(onSubmit)}>
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
              <Button themeColor="red" type="submit" name="update">
                Update
              </Button>
            </ActionGroup>
          </UpdateGoalForm>
        </div>
      </Dialog>
    </>
  );
};

export default UpdateGoal;
