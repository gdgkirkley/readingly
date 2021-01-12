import {
  TableInstance,
  UsePaginationInstanceProps,
  UsePaginationState,
  UseSortByColumnProps,
} from "react-table";

declare module "react-table" {
  export interface TableInstance<D extends object = {}>
    extends UsePaginationInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<D extends object = {}>
    extends UsePaginationState<D>,
      UseSortByState<D> {
    rowCount: number;
  }

  export interface ColumnInstance<D extends object = {}>
    extends UseSortByColumnProps<D> {}
}
