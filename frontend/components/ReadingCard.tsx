import React from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { Reading, DELETE_READING_PROGRESS_MUTATION } from "../graphql/reading";
import { formatDate, formatTimeFromDate } from "../lib/formatDates";
import Card from "./Card";
import { getReadingTimeString } from "../lib/time";
import OpenBook from "./icons/Book";
import RemoveButton from "./RemoveButton";
import { toast } from "react-toastify";
import { GOOGLE_BOOK_QUERY } from "../graphql/books";
import PrivacyIndicator from "./Privacy";

const ReadingCardStyle = styled(Card)`
  position: relative;
  & .top-icon {
    width: 8rem;
    color: ${(props) => props.theme.purple};
  }
`;

type PercentageProps = {
  width: string;
};

const PercentageBar = styled.div<PercentageProps>`
  width: 100%;
  background: ${(props) => props.theme.lightgrey};
  position: relative;

  & strong {
    position: relative;
    z-index: 1;
  }

  &::before {
    content: "";
    top: 0;
    left: 0;
    width: ${(props) => props.width};
    height: 100%;
    background-color: ${(props) => props.theme.yellow};
    position: absolute;
    z-index: 1;
  }
`;

type Props = {
  reading: Reading;
  totalPages?: number;
  googleBooksId: string;
};

const ReadingCard = ({ reading, totalPages, googleBooksId }: Props) => {
  const [removeReading, { loading, error }] = useMutation(
    DELETE_READING_PROGRESS_MUTATION,
    {
      onError: () => {
        toast.error("Unable to delete reading progress");
      },
    }
  );

  const handleRemove = async (): Promise<void> => {
    await removeReading({
      variables: {
        id: reading.id,
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

  const readingTimeRemaining = getReadingTimeString(
    reading.timeRemainingInSeconds
  );

  return (
    <ReadingCardStyle>
      <RemoveButton
        onConfirm={handleRemove}
        itemToRemove={`reading from ${formatDate(reading.createdAt)}`}
      />
      <OpenBook className="top-icon" />
      <h4>
        On page {reading.progress}
        {totalPages ? ` out of ${totalPages}` : null}
      </h4>
      <p>Added at {formatTimeFromDate(reading.createdAt)}</p>
      <p>{formatDate(reading.createdAt)}</p>
      {readingTimeRemaining ? <p>{readingTimeRemaining} to go</p> : null}
      <PercentageBar width={`${getPercentage(reading.progress, totalPages)}%`}>
        <strong>
          {totalPages
            ? `${getPercentage(reading.progress, totalPages)}%`
            : null}
        </strong>
      </PercentageBar>
    </ReadingCardStyle>
  );
};

function getPercentage(current: number, total: number): number {
  return round((current / total) * 100, 1);
}

function round(value: number, precision: number): number {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export default ReadingCard;
