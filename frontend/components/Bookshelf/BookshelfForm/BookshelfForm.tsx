import React, { PropsWithChildren } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { privacyOptionsArray } from "../../../lib/constants";
import Button from "../../styles/ButtonStyles";
import { ActionGroup, InputGroup } from "../../styles/FormStyles";
import { BookshelfFormStyle } from "./styles";

export type BookshelfFormInputs = {
  title: string;
  privacy: {
    value: number;
    label: string;
  };
};

type Props = {
  onSubmit: (data: BookshelfFormInputs) => void;
  defaultValues?: BookshelfFormInputs | null;
  submitButtonText?: string;
};

const BookshelfForm = ({
  onSubmit,
  defaultValues = {
    title: "",
    privacy: {
      value: 1,
      label: "Private",
    },
  },
  submitButtonText = "Create",
}: PropsWithChildren<Props>) => {
  const {
    register,
    handleSubmit,
    control,
    errors,
  } = useForm<BookshelfFormInputs>({ defaultValues });

  const submit = (data: BookshelfFormInputs) => {
    console.log(data);
    onSubmit(data);
  };

  return (
    <BookshelfFormStyle role="form" onSubmit={handleSubmit(submit)}>
      <InputGroup>
        <label htmlFor="title">What is this bookshelf called?</label>
        <input
          id="title"
          name="title"
          placeholder="To Read"
          ref={register({ required: true })}
          autoFocus
        />
        {errors.title?.type === "required" && (
          <p className="error-message" data-testid="validation-error">
            Title is required
          </p>
        )}
      </InputGroup>
      <InputGroup>
        <label id="privacy">Who can see this?</label>
        <Controller
          name="privacy"
          control={control}
          render={({ onChange, value, name, ref }) => {
            console.log(value);
            return (
              <Select
                name={name}
                value={value}
                aria-labelledby="privacy"
                onChange={onChange}
                ref={ref}
                menuPlacement="top"
                options={privacyOptionsArray}
              />
            );
          }}
        />
      </InputGroup>

      <ActionGroup justifyContent="center">
        <Button themeColor="purple" type="submit" name="create">
          {submitButtonText}
        </Button>
      </ActionGroup>
    </BookshelfFormStyle>
  );
};

export default BookshelfForm;
