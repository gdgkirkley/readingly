import React from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import Dialog from "../../Dialog";
import Button from "../../styles/ButtonStyles";
import {
  CREATE_BOOKSHELF_MUTATION,
  MY_BOOKSHELVES_QUERY,
} from "../../../graphql/bookshelves";
import useToggle from "../../../hooks/useToggle";
import BookshelfForm, { BookshelfFormInputs } from "../BookshelfForm";

const CreateBookShelf = () => {
  const [createBookshelf, { data, error, loading }] = useMutation(
    CREATE_BOOKSHELF_MUTATION,
    {
      onError: () => {
        toast.error("There was an error creating bookshelf");
      },
    }
  );
  const [open, toggleModal] = useToggle(false);

  const onSubmit = async (data: BookshelfFormInputs) => {
    await createBookshelf({
      variables: {
        title: data.title,
        privacyId: data.privacy.value,
      },
      refetchQueries: [{ query: MY_BOOKSHELVES_QUERY }],
    });

    if (!error && !loading) {
      toast.success(`${data.title} has been created!`);
      toggleModal();
    }
  };

  return (
    <>
      <Button themeColor="purple" onClick={toggleModal}>
        Add a bookshelf
      </Button>
      <Dialog
        role="dialog"
        accessibilityLabel="Create a bookshelf"
        toggleModal={toggleModal}
        open={open}
      >
        <div>
          <h1>Create a bookshelf</h1>
          <BookshelfForm onSubmit={onSubmit} />
        </div>
      </Dialog>
    </>
  );
};

export default CreateBookShelf;
