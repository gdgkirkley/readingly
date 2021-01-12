import React, { ReactElement, PropsWithChildren } from "react";
import {
  useTable,
  usePagination,
  TableOptions,
  useFlexLayout,
  useSortBy,
} from "react-table";
import DataTablePagination from "./DataTablePagination";
import {
  DataTableStyle,
  DataTableHeadRow,
  DataTableCell,
  DataTableRow,
  DataTableHeadCell,
} from "./TableStyles";

interface Table<T extends object> extends TableOptions<T> {
  name: string;
}

const hooks = [useSortBy, usePagination, useFlexLayout];

function DataTable<T extends object>({
  data,
  columns,
}: PropsWithChildren<Table<T>>): ReactElement {
  const instance = useTable<T>(
    {
      columns,
      data,
    },
    ...hooks
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
  } = instance;

  if (!data?.length) {
    return null;
  }

  return (
    <>
      <DataTableStyle {...getTableProps()}>
        <div>
          {headerGroups.map((headerGroup) => (
            <DataTableHeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <DataTableHeadCell
                  {...column.getSortByToggleProps()}
                  {...column.getHeaderProps()}
                  className={
                    column.canSort
                      ? `sortable ${column.isSorted ? "sorted" : ""}`
                      : ""
                  }
                >
                  <span>
                    {column.render("Header")}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </DataTableHeadCell>
              ))}
            </DataTableHeadRow>
          ))}
        </div>
        <div {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <DataTableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <DataTableCell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </DataTableCell>
                  );
                })}
              </DataTableRow>
            );
          })}
        </div>
      </DataTableStyle>
      <DataTablePagination<T> instance={instance} />
    </>
  );
}

export default DataTable;
