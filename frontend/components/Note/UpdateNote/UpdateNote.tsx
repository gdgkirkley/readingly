import { useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Note, UPDATE_NOTE_MUTATION } from "../../../graphql/notes";
import useToggle from "../../../hooks/useToggle";
import Dialog from "../../Dialog";
import Button from "../../styles/ButtonStyles";
import {
  ModalForm,
  InputGroup,
  ActionGroup,
  TextArea,
} from "../../styles/FormStyles";

type FormInputs = {
  note: string;
  page: string;
};

type Props = {
  note: Note;
};

const UpdateNote = ({ note }: Props) => {
  const [open, toggleModal] = useToggle(false);

  const { register, handleSubmit, errors } = useForm<FormInputs>({
    defaultValues: {
      note: note.note,
      page: note.page.toString(),
    },
  });

  const [updateNote, { loading, error }] = useMutation(UPDATE_NOTE_MUTATION, {
    onError: (error) => {
      toast.error(`There was an error updating note: ${error.message}`);
    },
  });

  const onSubmit = async (data: FormInputs) => {
    await updateNote({
      variables: {
        note: data.note,
        page: parseInt(data.page),
        id: note.id,
      },
    });

    if (!error && !loading) {
      toast.success(`Note updated!`);
      toggleModal();
    }
  };

  return (
    <>
      <Button themeColor="purple" onClick={toggleModal} invert={true}>
        Edit
      </Button>
      <Dialog
        role="dialog"
        accessibilityLabel="Update a note"
        toggleModal={toggleModal}
        open={open}
      >
        <div>
          <h1>Edit note</h1>
          <ModalForm role="form" onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <label htmlFor="note">What would you like to remember?</label>
              <TextArea name="note" ref={register({ required: true })} />
              {errors?.note?.type === "required" && (
                <p className="error-message" data-testid="validation-error">
                  Note is required
                </p>
              )}
            </InputGroup>
            <InputGroup>
              <label htmlFor="page">Page Number</label>
              <input
                type="number"
                name="page"
                defaultValue={0}
                ref={register({ min: 0 })}
              />
              {errors?.page?.type === "min" && (
                <p className="error-message" data-testid="validation-error">
                  Page cannot be less than 0
                </p>
              )}
            </InputGroup>
            <ActionGroup justifyContent="center">
              <Button themeColor="red" type="submit">
                Edit Note
              </Button>
            </ActionGroup>
          </ModalForm>
        </div>
      </Dialog>
    </>
  );
};

export default UpdateNote;
