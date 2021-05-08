import { graphql } from "msw";
import { buildBook } from "../test/generate";

export const handlers = [
  graphql.query("BOOK_QUERY", async (req, res, ctx) => {
    const book = await buildBook();
    return res(
      ctx.data({
        books: [
          {
            googleBooksId: book.googleBooksId,
            title: book.title,
            thumbnail: book.thumbnail,
            __typename: "Book",
          },
        ],
      })
    );
  }),
];
