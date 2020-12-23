import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Dialog from "./Dialog";
import Button from "./styles/ButtonStyles";
import FormStyles, { InputGroup, ActionGroup } from "./styles/FormStyles";
import { GoalType, CREATE_GOAL_MUTATION } from "../graphql/goal";
import { GOOGLE_BOOK_QUERY } from "../graphql/books";
import { MY_BOOKSHELF_QUERY } from "../graphql/bookshelves";
import { toast } from "react-toastify";
import {
  formatDate,
  formatDateForInput,
  parseStringDateISO,
} from "../lib/formatDates";
import { statusOptions } from "./Goal/utils/constants";

const CreateGoalForm = styled(FormStyles)`
  box-shadow: none;
  width: 100%;
  margin: 0;
  padding: 0;
`;

type FormInputs = {
  goalDate: string;
  startDate: string;
  status: { value: string; label: string };
};

type Props = {
  goalableType: GoalType;
  goalableId: string;
  bookshelfTitle?: string;
};

const CreateGoal = ({ goalableType, goalableId, bookshelfTitle }: Props) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      startDate: formatDateForInput(new Date()),
      status: statusOptions[0],
    },
  });

  const [createGoal, { loading, error }] = useMutation(CREATE_GOAL_MUTATION, {
    onError: (error) => {
      toast.error(`There was an error creating goal: ${error.message}`);
    },
  });

  const toggle = () => setOpen(!open);

  useEffect(() => {
    setValue("status", statusOptions[0]);
  }, []);

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
        startDate: parseStringDateISO(data.startDate),
        status: data.status.value,
      },
      refetchQueries: [refetchQuery],
      awaitRefetchQueries: true,
    });

    if (!error && !loading) {
      toast.success("Goal created!");
      setOpen(false);
    }
  };

  const goalableTypeText =
    goalableType === GoalType.Book ? "this book" : "books on this shelf";

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
              <label htmlFor="startDate">
                When did you start reading {goalableTypeText}?
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={formatDateForInput(new Date())}
                ref={register}
              />
            </InputGroup>
            <InputGroup>
              <label htmlFor="goalDate">
                When would you like to finish reading?
              </label>
              <input
                id="goalDate"
                name="goalDate"
                type="date"
                ref={register({ required: true })}
                autoFocus
              />
              {errors.goalDate?.type === "required" && (
                <p className="error-message" data-testid="validation-error">
                  Goal date is required
                </p>
              )}
            </InputGroup>
            <InputGroup>
              {/*
                react-select renders a div which requires an aria-labelledby property
                instead of using the native label htmlFor
              */}
              <label id="status">
                What is the status of {goalableTypeText}?
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
