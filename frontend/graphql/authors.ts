import { Book } from "./books";

export interface Author {
  name: string;
  books: Book[];
  createdAt: string;
  updatedAt: string;
}
