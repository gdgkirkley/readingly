import React from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import { Book } from "../graphql/books";
import {
  MY_BOOKSHELVES_QUERY,
  ADD_BOOK_MUTATION,
  BookShelfData,
} from "../graphql/bookshelves";
import { useUser } from "../hooks/useUser";

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
      refetchQueries: [{ query: MY_BOOKSHELVES_QUERY }],
      awaitRefetchQueries: true,
    });
  };

  if (!me) return null;

  if (loading) return <p>Loading bookshelves...</p>;
  if (error) {
    toast.error("There was an error loading bookshelves. Please refresh.");
  }

  return <button onClick={handleClick}>Add to Bookshelf</button>;
};

export default AddToBookshelf;
