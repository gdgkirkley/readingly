import React from "react";
import { useQuery } from "@apollo/client";
import { GOOGLE_BOOK_QUERY, BookData } from "../graphql/books";
import BookGallery from "./BookGallery";

const Book = ({ googleBooksId }: { googleBooksId: string }) => {
  const { data, loading, error } = useQuery<BookData>(GOOGLE_BOOK_QUERY, {
    variables: { googleBooksId: googleBooksId },
  });

  if (loading) return <p>Loading....</p>;

  if (error) return <p>Uh oh! {error.message}</p>;

  return (
    <div>
      <h1>{data.googleBook.title}</h1>
      {data.googleBook?.authors.length && (
        <p data-testid="book-authors">
          By {data.googleBook.authors.map((author) => author)}
        </p>
      )}
      {data.googleBook.thumbnail && (
        <img src={data.googleBook.thumbnail} alt={data.googleBook.title} />
      )}
      <div
        dangerouslySetInnerHTML={{ __html: data.googleBook.description }}
        data-testid="book-description"
      />
      <div>
        <h2>You May Also Like</h2>
        <BookGallery searchTerm={data.googleBook.authors[0]} />
        {data.googleBook?.categories?.length &&
          data.googleBook.categories.map((category) => (
            <BookGallery key={category} searchTerm={category} />
          ))}
      </div>
    </div>
  );
};

export default Book;
