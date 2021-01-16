import React from "react";
import { gql, useMutation } from "@apollo/client";
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
      update(cache, { data: { createBookshelf } }) {
        cache.modify({
          fields: {
            mybookshelves(existingBookshelfRefs = [], { readField }) {
              const newBookshelfRef = cache.writeFragment({
                data: createBookshelf,
                fragment: gql`
                  fragment NewBookshelf on BookShelf {
                    id
                    title
                    privacyId
                  }
                `,
              });

              // If the new bookshelf is already present in the cahce,
              // we don't need to add again
              if (
                existingBookshelfRefs.some(
                  (ref) => readField("id", ref) === createBookshelf.id
                )
              ) {
                return existingBookshelfRefs;
              }

              return [...existingBookshelfRefs, newBookshelfRef];
            },
          },
        });
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
