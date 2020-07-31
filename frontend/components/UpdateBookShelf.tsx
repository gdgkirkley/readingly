import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import Dialog from "./Dialog";
import Button from "./styles/ButtonStyles";
import { useForm } from "react-hook-form";
import FormStyles, { InputGroup, ActionGroup } from "./styles/FormStyles";
import {
  UPDATE_BOOKSHELF_MUTATION,
  MY_BOOKSHELVES_QUERY,
} from "../graphql/bookshelves";

const CreateBookShelfForm = styled(FormStyles)`
  box-shadow: none;
  width: 100%;
  margin: 0;
  padding: 0;
`;

type FormInputs = {
  title: string;
};

type Props = {
  bookshelfId: string;
  title: string;
};

const UpdateBookshelf = ({ bookshelfId, title }: Props) => {
  const [updateBookshelf, { data, error, loading }] = useMutation(
    UPDATE_BOOKSHELF_MUTATION
  );
  const { register, handleSubmit, reset } = useForm<FormInputs>({
    defaultValues: {
      title: title,
    },
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!title) return;
    reset({
      title: title,
    });
  }, [title]);

  const toggleModal = () => {
    setOpen(!open);
  };

  const onSubmit = async (data: FormInputs) => {
    await updateBookshelf({
      variables: {
        bookshelfId: bookshelfId,
        title: data.title,
      },
      refetchQueries: [{ query: MY_BOOKSHELVES_QUERY }],
    });

    if (!error && !loading) {
      toast.success(`${data.title} has been updated!`);
      setOpen(false);
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
          <CreateBookShelfForm role="form" onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <label htmlFor="title">Bookshelf Title</label>
              <input
                id="title"
                name="title"
                placeholder="To Read"
                ref={register}
                autoFocus
              />
            </InputGroup>
            <ActionGroup justifyContent="center">
              <Button themeColor="purple" type="submit">
                Edit
              </Button>
            </ActionGroup>
          </CreateBookShelfForm>
        </div>
      </Dialog>
    </>
  );
};

export default UpdateBookshelf;
