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
  mutation($id: ID!, $goalDate: String!, $startDate: String, $endDate: String, $status: String) {
    updateGoal(id: $id, goalDate: $goalDate, , startDate: $startDate, endDate: $endDate, status: $status) {
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
  startDate: string;
  endDate: string;
  status: GoalStatus;
  readingRecommendation: number;
  readingRecommendationSeconds?: number
};

export enum GoalStatus {
  NotStarted = "NOTSTARTED",
  InProgress = "INPROGRESS",
  Complete = "COMPLETE"
}

export enum GoalType {
  Book = "BOOK",
  BookShelf = "BOOKSHELF",
}
