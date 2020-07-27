import React from "react";
import Book from "../../components/Book";

const BookPage = (props) => {
  return (
    <div>
      <Book googleBooksId={props.query.googleBooksId} />
    </div>
  );
};

export default BookPage;
