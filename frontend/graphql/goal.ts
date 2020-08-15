import { gql } from "@apollo/client";
import { Book } from "./books";
import { BookShelf } from "./bookshelves";

export const CREATE_GOAL_MUTATION = gql`
  mutation($goalDate: String!, $goalableId: ID!) {
    createGoal(goalDate: $goalDate, goalableId: $goalableId) {
      id
      goalableType
    }
  }
`;

export type Goal = {
  id: string;
  goalDate: string;
  goalableId: string;
  goalableType: GoalType;
  goalable: Book | BookShelf;
};

export enum GoalType {
  Book = "BOOK",
  BookShelf = "BOOKSHELF",
}
