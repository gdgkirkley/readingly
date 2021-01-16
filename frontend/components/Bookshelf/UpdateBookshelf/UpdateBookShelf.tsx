import * as React from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import Dialog from "../../Dialog";
import Button from "../../styles/ButtonStyles";
import { UPDATE_BOOKSHELF_MUTATION } from "../../../graphql/bookshelves";
import useToggle from "../../../hooks/useToggle";
import BookshelfForm, { BookshelfFormInputs } from "../BookshelfForm";

type Props = {
  bookshelfId: string;
  title: string;
  privacy: {
    value: number;
    label: string;
  };
};

const UpdateBookshelf = ({ bookshelfId, title, privacy }: Props) => {
  const [updateBookshelf, { error, loading }] = useMutation(
    UPDATE_BOOKSHELF_MUTATION,
    {
      onError: () => {
        toast.error(`There was an error updating ${title}`);
      },
    }
  );
  const [open, toggleModal] = useToggle(false);

  const onSubmit = async (data: BookshelfFormInputs) => {
    await updateBookshelf({
      variables: {
        bookshelfId: bookshelfId,
        title: data.title,
        privacyId: data.privacy.value,
      },
    });

    if (!error && !loading) {
      toast.success(`${data.title} has been updated!`);
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
        accessibilityLabel="Create a bookshelf"
        toggleModal={toggleModal}
        open={open}
      >
        <div>
          <h1>Update {title}</h1>
          <BookshelfForm
            onSubmit={onSubmit}
            defaultValues={{ title, privacy }}
            submitButtonText="Update"
          />
        </div>
      </Dialog>
    </>
  );
};

export default UpdateBookshelf;
