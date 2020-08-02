import React, { useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import styled from "styled-components";
import Button from "./styles/ButtonStyles";
import {
  REMOVE_BOOK_MUTATION,
  MY_BOOKSHELF_QUERY,
  MY_BOOKSHELVES_QUERY,
  BookShelf,
} from "../graphql/bookshelves";
import Dialog, { InnerDialogContent } from "./Dialog";
import { Book } from "../graphql/books";

const RemoveButton = styled(Button)`
  position: absolute;
  top: -1rem;
  right: -1rem;
  border-radius: 1000px;
  font-size: 1rem;
  line-height: 1;
  padding: 0.8rem 1rem;

  @media (max-width: 768px) {
    right: 0.5rem;
    padding: 1.3rem 1.5rem;
  }
`;

type Props = {
  book: Book;
  bookshelf: BookShelf;
};

const RemoveBook = ({ book, bookshelf }: Props) => {
  const [open, setOpen] = useState(false);
  const [removeBook, { loading, error }] = useMutation(REMOVE_BOOK_MUTATION, {
    onError: () => {
      toast.error(`There was an error removing ${book.title}`);
    },
  });

  const toggle = () => setOpen(!open);

  const handleConfirm = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();

    if (!book.googleBooksId || !bookshelf.id) {
      return;
    }

    await removeBook({
      variables: {
        googleBooksId: book.googleBooksId,
        bookshelfId: bookshelf.id,
      },
      refetchQueries: [
        { query: MY_BOOKSHELF_QUERY, variables: { title: bookshelf.title } },
        { query: MY_BOOKSHELVES_QUERY },
      ],
      awaitRefetchQueries: true,
    });

    if (!loading && !error) {
      toast.success(`${book.title} removed from ${bookshelf.title}!`);
    }
  };

  return (
    <>
      <RemoveButton themeColor="red" onClick={toggle}>
        x<span className="hidden-text">Remove from bookshelf</span>
      </RemoveButton>

      <Dialog
        open={open}
        role="dialog"
        accessibilityLabel="deletion confirmation"
        toggleModal={toggle}
      >
        <InnerDialogContent>
          <h1>Confirm Removal</h1>
          <p>
            Are you sure you want to remove <strong>{book.title}</strong> from{" "}
            <strong>{bookshelf.title}</strong>?
          </p>
          <div className="container">
            <Button themeColor="red" onClick={handleConfirm}>
              Confirm Remove
            </Button>
          </div>
        </InnerDialogContent>
      </Dialog>
    </>
  );
};

export default RemoveBook;
