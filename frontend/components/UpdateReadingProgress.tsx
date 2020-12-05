import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Button from "./styles/ButtonStyles";
import Form, { ActionGroup, InputGroup } from "./styles/FormStyles";
import Dialog, { InnerDialogContent } from "./Dialog";
import { Book, GOOGLE_BOOK_QUERY } from "../graphql/books";
import { useMutation } from "@apollo/client";
import { ADD_READING_PROGRESS_MUTATION } from "../graphql/reading";
import { toast } from "react-toastify";

const ReadingProgressForm = styled(Form)`
  box-shadow: none;
  width: 100%;
  margin: 0;
  padding: 0;

  & ${InputGroup} {
    & input {
      display: inline-block;
      width: 8rem;
      margin: 0 1rem;
      padding: 1rem 1rem;
    }
  }
`;

type Props = {
  book: Book;
};

type FormData = {
  progress: string;
};

const UpdateReadingProgress = ({ book }: Props) => {
  const [open, setOpen] = useState(false);

  const [addReadingProgress, { data, error, loading }] = useMutation(
    ADD_READING_PROGRESS_MUTATION
  );

  const { register, handleSubmit, errors } = useForm<FormData>();

  const toggle = () => setOpen(!open);

  const onSubmit = async (formData: FormData) => {
    await addReadingProgress({
      variables: {
        googleBooksId: book.googleBooksId,
        progress: parseFloat(formData.progress),
      },
      refetchQueries: [
        {
          query: GOOGLE_BOOK_QUERY,
          variables: { googleBooksId: book.googleBooksId },
        },
      ],
    });

    if (!error) {
      toast.success(`Reading progress added!`);
      toggle();
    }
  };

  return (
    <>
      <Button themeColor="purple" onClick={toggle}>
        Add Reading Progress
      </Button>
      <Dialog
        role="dialog"
        toggleModal={toggle}
        open={open}
        accessibilityLabel="Add reading progress"
      >
        <InnerDialogContent>
          <ReadingProgressForm role="form" onSubmit={handleSubmit(onSubmit)}>
            <h1>Add Reading Progress</h1>
            <InputGroup>
              <label htmlFor="progress">Currently on page</label>
              <input
                type="number"
                id="progress"
                name="progress"
                ref={register({
                  required: true,
                  validate: (value) => {
                    return value <= book.pageCount;
                  },
                })}
                autoFocus
              />
              <strong>out of {book.pageCount} pages</strong>
              {errors?.progress?.type === "required" && (
                <p className="error-message" data-testid="validation-error">
                  Page count is required.
                </p>
              )}
              {errors?.progress?.type === "validate" && (
                <p className="error-message" data-testid="validation-error">
                  Page count can't be more than the total pages!
                </p>
              )}
            </InputGroup>
            <ActionGroup justifyContent="center">
              <Button themeColor="purple" disabled={loading}>
                Add{loading ? "ing" : null} Progress
              </Button>
            </ActionGroup>
          </ReadingProgressForm>
        </InnerDialogContent>
      </Dialog>
    </>
  );
};

export default UpdateReadingProgress;
