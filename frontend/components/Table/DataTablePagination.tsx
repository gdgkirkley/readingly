import React, { PropsWithChildren, ReactElement, useCallback } from "react";
import { TableInstance } from "react-table";
import Button from "../styles/ButtonStyles";
import { PaginationContainer } from "./TableStyles";

function DataTablePagination<T extends object>({
  instance,
}: PropsWithChildren<{ instance: TableInstance<T> }>): ReactElement | null {
  const {
    state: { pageIndex, pageSize, rowCount = instance.rows.length },
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
    pageCount,
    pageOptions,
  } = instance;

  const handleChangePage = useCallback(
    (newPage: number) => {
      if (newPage === pageIndex + 1) {
        nextPage();
      } else if (newPage === pageIndex - 1) {
        previousPage();
      } else {
        gotoPage(newPage);
      }
    },
    [gotoPage, nextPage, pageIndex, previousPage]
  );

  if (rowCount <= 10) {
    return null;
  }

  return (
    <PaginationContainer>
      <div>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
      </div>
      <div>
        <Button
          themeColor="purple"
          onClick={() => handleChangePage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </Button>{" "}
        <Button
          themeColor="purple"
          onClick={() => handleChangePage(pageIndex - 1)}
          disabled={!canPreviousPage}
        >
          {"<"}
        </Button>{" "}
        <Button
          themeColor="purple"
          onClick={() => handleChangePage(pageIndex + 1)}
          disabled={!canNextPage}
        >
          {">"}
        </Button>{" "}
        <Button
          themeColor="purple"
          onClick={() => handleChangePage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </Button>
      </div>
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </PaginationContainer>
  );
}

export default DataTablePagination;
