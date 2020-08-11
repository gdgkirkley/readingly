import React from "react";
import { useQuery } from "@apollo/client";
import { MY_BOOKSHELF_QUERY, BookShelfData } from "../graphql/bookshelves";
import BookGallery from "./BookGallery";
import { formatDate } from "../lib/formatDates";
import { getReadingTimeString } from "../lib/time";

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
      <p data-testid="bookshelf-count">
        There {shelf.bookCount == 1 ? "is" : "are"} {shelf.bookCount} book
        {shelf.bookCount == 1 ? null : "s"} on this list
      </p>
      <p>
        It will take about{" "}
        <strong>
          {getReadingTimeString(shelf.averageTimeToReadInSeconds)}
        </strong>{" "}
        to read all the books on this list.
      </p>
      <BookGallery books={shelf.books} displayRemove={true} bookshelf={shelf} />
      <p>You created this list on {formatDate(shelf.createdAt)}</p>
    </div>
  );
};

export default Bookshelf;
