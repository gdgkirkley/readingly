import React, { PropsWithChildren } from "react";
import { Column } from "react-table";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import {
  DELETE_READING_PROGRESS_MUTATION,
  Reading,
} from "../../../graphql/reading";
import DataTable from "../../Table/DataTable";
import { PercentageBar } from "./styles";
import {
  formatDate,
  getReadingTimeString,
  formatTimeFromDate,
  getPercentage,
} from "../../../lib/";
import PrivacyIndicator from "../../Privacy";
import { GOOGLE_BOOK_QUERY } from "../../../graphql/books";
import RemoveButton from "../../RemoveButton";

type Props = {
  reading: Reading[];
  totalPages: number;
  googleBooksId: string;
};

const ReadingList = ({
  reading,
  totalPages,
  googleBooksId,
}: PropsWithChildren<Props>) => {
  const [removeReading, { loading, error }] = useMutation(
    DELETE_READING_PROGRESS_MUTATION,
    {
      onError: () => {
        toast.error("Unable to delete reading progress");
      },
    }
  );

  const handleRemove = async ({ readingId }): Promise<void> => {
    await removeReading({
      variables: {
        id: readingId,
      },
      refetchQueries: [
        {
          query: GOOGLE_BOOK_QUERY,
          variables: { googleBooksId: googleBooksId },
        },
      ],
      awaitRefetchQueries: true,
    });

    if (!loading && !error) {
      toast.success("Reading progress deleted!");
    }
  };

  const columns: Column<Reading>[] = [
    {
      Header: "Page",
      accessor: "progress",
      width: 160,
      Cell: (props) => `${props.value} out of ${totalPages}`,
    },
    {
      Header: "Time",
      width: 110,
      minWidth: 110,
      Cell: (props) => formatTimeFromDate(props.row.values.createdAt),
    },
    {
      Header: "Date",
      accessor: "createdAt",
      width: 200,
      Cell: (props) => formatDate(props.value),
    },
    {
      Header: "Time Left To Read",
      accessor: "timeRemainingInSeconds",
      Cell: (props) => getReadingTimeString(props.value),
    },
    {
      Header: "Progress",
      Cell: (props) => (
        <PercentageBar
          width={`${getPercentage(props.row.values.progress, totalPages)}%`}
        >
          <strong>
            {totalPages
              ? `${getPercentage(props.row.values.progress, totalPages)}%`
              : null}
          </strong>
        </PercentageBar>
      ),
    },
    {
      Header: "Privacy",
      accessor: "privacyLevel",
      width: 120,
      Cell: (props) => (
        <div>
          <PrivacyIndicator privacyLevel={props.value} />
        </div>
      ),
    },
    {
      Header: "Action",
      width: 70,
      Cell: (props) => (
        <RemoveButton
          onConfirm={() => handleRemove({ readingId: props.row.original.id })}
          asAbolute={false}
          itemToRemove="reading"
          buttonText="X"
        />
      ),
    },
  ];
  const dataColumns = React.useMemo(() => columns, []);

  return (
    <div>
      <DataTable<Reading>
        name="Reading List"
        data={reading}
        columns={dataColumns}
      />
    </div>
  );
};

export default ReadingList;
