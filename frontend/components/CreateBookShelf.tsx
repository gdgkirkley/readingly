import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import Dialog from "./Dialog";
import Button from "./styles/ButtonStyles";
import { useForm } from "react-hook-form";
import FormStyles, { InputGroup, ActionGroup } from "./styles/FormStyles";
import {
  CREATE_BOOKSHELF_MUTATION,
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

const CreateBookShelf = () => {
  const [createBookshelf, { data, error, loading }] = useMutation(
    CREATE_BOOKSHELF_MUTATION
  );
  const { register, handleSubmit } = useForm<FormInputs>();
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    setOpen(!open);
  };

  const onSubmit = async (data: FormInputs) => {
    await createBookshelf({
      variables: {
        title: data.title,
      },
      refetchQueries: [{ query: MY_BOOKSHELVES_QUERY }],
    });

    if (!error && !loading) {
      toast.success(`${data.title} has been created!`);
      setOpen(false);
    }
  };

  return (
    <>
      <Button themeColor="purple" onClick={toggleModal}>
        Create a bookshelf
      </Button>
      <Dialog
        role="dialog"
        accessibilityLabel="Create a bookshelf"
        toggleModal={toggleModal}
        open={open}
      >
        <div>
          <h1>Create a bookshelf</h1>
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
                Create
              </Button>
            </ActionGroup>
          </CreateBookShelfForm>
        </div>
      </Dialog>
    </>
  );
};

export default CreateBookShelf;
