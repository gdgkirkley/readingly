import { gql } from "@apollo/client";
import { Book } from "./books";
import { BookShelf } from "./bookshelves";

export const CREATE_GOAL_MUTATION = gql`
  mutation($goalDate: String!, $goalableId: ID!, $startDate: String, $status: String) {
    createGoal(goalDate: $goalDate, goalableId: $goalableId, startDate: $startDate, status: $status) {
      id
      goalDate
      goalableType
    }
  }
`;

export const UPDATE_GOAL_MUTATION = gql`
  mutation($id: ID!, $goalDate: String!) {
    updateGoal(id: $id, goalDate: $goalDate) {
      id
      goalDate
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
