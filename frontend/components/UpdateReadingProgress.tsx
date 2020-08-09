import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Button from "./styles/ButtonStyles";
import Form, { ActionGroup, InputGroup } from "./styles/FormStyles";
import Dialog, { InnerDialogContent } from "./Dialog";
import { Book } from "../graphql/books";
import { useMutation } from "@apollo/client";
import { ADD_READING_PROGRESS_MUTATION } from "../graphql/reading";

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
  progress: number;
};

const UpdateReadingProgress = ({ book }: Props) => {
  const [open, setOpen] = useState(false);

  const [addReadingProgress, { data, error, loading }] = useMutation(
    ADD_READING_PROGRESS_MUTATION
  );

  const { register, handleSubmit } = useForm<FormData>();

  const toggle = () => setOpen(!open);

  const onSubmit = (formData) => {
    addReadingProgress({
      variables: {
        googleBooksId: book.googleBooksId,
        progress: formData.progress,
      },
    });
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
                ref={register}
              />
              <strong>out of {book.pageCount} pages</strong>
            </InputGroup>
            <ActionGroup justifyContent="center">
              <Button themeColor="purple">
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
