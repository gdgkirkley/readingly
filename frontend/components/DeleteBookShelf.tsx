import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import Dialog from "./Dialog";
import Button from "./styles/ButtonStyles";
import {
  DELETE_BOOKSHELF_MUTATION,
  MY_BOOKSHELVES_QUERY,
} from "../graphql/bookshelves";

const DeleteModalContent = styled.div`
  display: grid;
  grid-gap: 12px;
  justify-content: center;
  align-items: center;
`;

type Props = {
  bookshelfId: string;
  title: string;
};

const DeleteBookshelf = ({ bookshelfId, title }: Props) => {
  const [deleteBookshelf, { data, error, loading }] = useMutation(
    DELETE_BOOKSHELF_MUTATION
  );
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    setOpen(!open);
  };

  const handleConfirm = async (): Promise<void> => {
    await deleteBookshelf({
      variables: {
        bookshelfId: bookshelfId,
      },
      refetchQueries: [{ query: MY_BOOKSHELVES_QUERY }],
    });

    if (!error && !loading) {
      toast.success(`${title} has been deleted!`);
      setOpen(false);
    }
  };

  return (
    <>
      <Button themeColor="red" onClick={toggleModal} invert={true}>
        Delete
      </Button>
      <Dialog
        role="dialog"
        accessibilityLabel="Create a bookshelf"
        toggleModal={toggleModal}
        open={open}
      >
        <DeleteModalContent>
          <h2>Confirm Deletion</h2>
          <strong>
            Are you sure you want to delete {title}? This action cannot be
            undone.
          </strong>
          <Button themeColor="red" type="submit" onClick={handleConfirm}>
            Delete Permanently
          </Button>
        </DeleteModalContent>
      </Dialog>
    </>
  );
};

export default DeleteBookshelf;
