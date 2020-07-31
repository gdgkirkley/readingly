import React from "react";
import { useQuery } from "@apollo/client";
import { MY_BOOKSHELF_QUERY, BookShelfData } from "../graphql/bookshelves";
import BookGallery from "./BookGallery";

type Props = {
  title: string;
};

const Bookshelf = ({ title }: Props) => {
  const { error, loading, data } = useQuery<BookShelfData>(MY_BOOKSHELF_QUERY, {
    variables: {
      title,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>There was an error loading this shelf.</p>;

  const shelf = data.mybookshelf;

  return (
    <div>
      <h1>{shelf.title}</h1>
      <BookGallery books={shelf.books} />
    </div>
  );
};

export default Bookshelf;
