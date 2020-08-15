import { Book } from "./books";
import { BookShelf } from "./bookshelves";

export type Goal = {
  id: string;
  goalDate: string;
  goalableId: string;
  goalableType: GoalType;
  goalable: Book | BookShelf;
};

enum GoalType {
  Book = "BOOK",
  BookShelf = "BOOKSHELF",
}
