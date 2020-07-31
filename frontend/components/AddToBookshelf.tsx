import React from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import { Book } from "../graphql/books";
import {
  MY_BOOKSHELVES_QUERY,
  MY_BOOKSHELF_QUERY,
  ADD_BOOK_MUTATION,
  BookShelfData,
} from "../graphql/bookshelves";
import { useUser } from "../hooks/useUser";
import Button from "./styles/ButtonStyles";

const AddToBookshelfButton = styled(Button)`
  margin: 2rem 0 3rem;
`;

type Props = {
  book: Book;
};

const AddToBookshelf = ({ book }: Props) => {
  const me = useUser();
  const { data, error, loading } = useQuery<BookShelfData>(
    MY_BOOKSHELVES_QUERY
  );

  const [
    addBook,
    { data: dataAdd, error: errorAdd, loading: loadingAdd },
  ] = useMutation(ADD_BOOK_MUTATION);

  const handleClick = (): void => {
    addBook({
      variables: {
        googleBookId: book.googleBooksId,
        bookshelfId: data.mybookshelves[0].id,
      },
      refetchQueries: [
        { query: MY_BOOKSHELVES_QUERY },
        {
          query: MY_BOOKSHELF_QUERY,
          variables: { title: data.mybookshelves[0].title },
        },
      ],
      awaitRefetchQueries: true,
    });

    toast.success(`${book.title} added to ${data.mybookshelves[0].title}!`);
  };

  if (!me) return null;

  if (loading) return <p>Loading bookshelves...</p>;
  if (error) {
    toast.error("There was an error loading bookshelves. Please refresh.");
  }

  return (
    <AddToBookshelfButton themeColor="yellow" onClick={handleClick}>
      Add to bookshelf
    </AddToBookshelfButton>
  );
};

export default AddToBookshelf;
