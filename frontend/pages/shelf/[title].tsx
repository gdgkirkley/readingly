import React from "react";
import Bookshelf from "../../components/Bookshelf";

const BookshelfPage = (props) => {
  return (
    <div>
      <Bookshelf title={props.query.title} />
    </div>
  );
};

export default BookshelfPage;
