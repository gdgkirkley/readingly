import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import Dialog from "../../Dialog";
import Button from "../../styles/ButtonStyles";
import FormStyles, { InputGroup, ActionGroup } from "../../styles/FormStyles";
import {
  Goal,
  GoalStatus,
  GoalType,
  UPDATE_GOAL_MUTATION,
} from "../../../graphql/goal";
import { GOOGLE_BOOK_QUERY } from "../../../graphql/books";
import { MY_BOOKSHELF_QUERY } from "../../../graphql/bookshelves";
import { formatDate, parseStringDateISO } from "../../../lib/formatDates";
import { statusOptions } from "../utils/constants";

const UpdateGoalForm = styled(FormStyles)`
  box-shadow: none;
  width: 100%;
  margin: 0;
  padding: 0;
`;

type FormInputs = {
  goalDate: string;
  startDate: string;
  endDate: string;
  status: { value: string; label: string };
};

type Props = {
  goal: Goal;
  bookshelfTitle?: string;
};

const UpdateGoal = ({ goal, bookshelfTitle }: Props) => {
  const [open, setOpen] = useState(false);
  const statusLabel = statusOptions.find((stat) => stat.value === goal.status);
  const { register, handleSubmit, control, getValues } = useForm<FormInputs>({
    defaultValues: {
      goalDate: goal.goalDate,
      startDate: goal.startDate,
      endDate: goal.endDate,
      status: { value: goal.status, label: statusLabel?.label },
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
        startDate: parseStringDateISO(data.startDate),
        endDate: parseStringDateISO(data.endDate),
        status: data.status.value,
        goalDate: parseStringDateISO(data.goalDate),
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

  const goalableTypeText =
    goal.goalableType === GoalType.Book ? "this book" : "books on this shelf";

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
            <InputGroup>
              <label htmlFor="startDate">When did you start reading?</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                ref={register}
              />
            </InputGroup>
            <InputGroup>
              {/*
                react-select renders a div which requires an aria-labelledby property
                instead of using the native label htmlFor
              */}
              <label id="status">
                My reading status for {goalableTypeText} is:
              </label>
              <Controller
                as={Select}
                name="status"
                aria-labelledby="status"
                menuPlacement="top"
                options={statusOptions}
                defaultValue={""}
                control={control}
              />
            </InputGroup>

            <InputGroup>
              <label htmlFor="endDate">
                When did you complete {goalableTypeText}?
              </label>
              <input id="endDate" name="endDate" type="date" ref={register} />
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
