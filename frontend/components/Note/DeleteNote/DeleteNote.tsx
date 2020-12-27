import { Reference, useMutation } from "@apollo/client";
import React from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { DELETE_NOTE_MUTATION, NOTES_QUERY } from "../../../graphql/notes";
import useToggle from "../../../hooks/useToggle";
import Dialog from "../../Dialog";
import Button from "../../styles/ButtonStyles";

const DeleteModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & button {
    margin: 2rem 0;
  }
`;

type Props = {
  noteId: string;
};

const DeleteNote = ({ noteId }: Props) => {
  const [open, toggleModal] = useToggle(false);

  const [deleteNote, { error, loading }] = useMutation(DELETE_NOTE_MUTATION, {
    onError: () => {
      toast.error(`There was an error deleting this note.`);
    },
  });

  const handleConfirm = async (): Promise<void> => {
    await deleteNote({
      variables: {
        id: noteId,
      },
      update(cache) {
        cache.modify({
          fields: {
            notes(existingNoteRefs, { readField }) {
              return existingNoteRefs.filter(
                (noteRef: Reference) => noteId !== readField("id", noteRef)
              );
            },
          },
        });
      },
    });

    if (!error && !loading) {
      toast.success(`Note deleted!`);
      toggleModal();
    }
  };

  return (
    <>
      <Button themeColor="red" invert={true} onClick={toggleModal}>
        Delete
      </Button>
      <Dialog
        role="dialog"
        accessibilityLabel="Delete note"
        toggleModal={toggleModal}
        open={open}
      >
        <DeleteModalContent>
          <h1>Confirm Delete</h1>
          <strong>
            Are you sure you want to delete this note? This cannot be undone.
          </strong>
          <Button themeColor="red" onClick={handleConfirm}>
            Delete Permanently
          </Button>
        </DeleteModalContent>
      </Dialog>
    </>
  );
};

export default DeleteNote;
