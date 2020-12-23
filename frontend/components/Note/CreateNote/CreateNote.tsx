import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import useToggle from "../../../hooks/useToggle";
import Dialog from "../../Dialog";
import Button from "../../styles/ButtonStyles";
import FormStyles, { InputGroup, ActionGroup } from "../../styles/FormStyles";
import { useMutation } from "@apollo/client";
import { CREATE_NOTE_MUTATION } from "../../../graphql/notes";
import { toast } from "react-toastify";

const CreateNoteForm = styled(FormStyles)`
  box-shadow: none;
  width: 100%;
  margin: 0;
  padding: 0;
`;

const NoteTextArea = styled.textarea`
  min-height: 10rem;
`;

type FormInputs = {
  note: string;
  page?: number;
};

type Props = {
  googleBooksId: string;
};

const CreateNote = ({ googleBooksId }: Props) => {
  const [isModalOpen, toggleModal] = useToggle(false);

  const { register, handleSubmit, errors } = useForm<FormInputs>();

  const [createNote, { loading, error }] = useMutation(CREATE_NOTE_MUTATION, {
    onError: (error) => {
      toast.error(`There was an error creating note: ${error.message}`);
    },
  });

  const onSubmit = async (data: FormInputs) => {
    await createNote({
      variables: {
        ...data,
        googleBooksId,
      },
    });

    if (!error && !loading) {
      toast.success("Note created!");
      toggleModal();
    }
  };

  return (
    <>
      <Button themeColor="red" onClick={toggleModal}>
        Create Note
      </Button>
      <Dialog
        role="dialog"
        accessibilityLabel="Create a note"
        toggleModal={toggleModal}
        open={isModalOpen}
      >
        <div>
          <h1>Create a reading note</h1>
          <CreateNoteForm role="form" onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <label htmlFor="note">What would you like to remember?</label>
              <NoteTextArea name="note" ref={register({ required: true })} />
              {errors?.note?.type === "required" && (
                <p className="error-message" data-testid="validation-error">
                  Note is required
                </p>
              )}
            </InputGroup>
            <InputGroup>
              <label htmlFor="page">
                Enter a page number to remember where you were:
              </label>
              <input type="number" name="page" ref={register({ min: 0 })} />
              {errors?.page?.type === "min" && (
                <p className="error-message" data-testid="validation-error">
                  Page cannot be less than 0
                </p>
              )}
            </InputGroup>
            <ActionGroup>
              <Button themeColor="red" type="submit">
                Create Note
              </Button>
            </ActionGroup>
          </CreateNoteForm>
        </div>
      </Dialog>
    </>
  );
};

export default CreateNote;
