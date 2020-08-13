import React from "react";
import styled from "styled-components";
import { Reading } from "../graphql/reading";
import { formatDate } from "../lib/formatDates";
import Card from "./Card";
import { getReadingTimeString } from "../lib/time";
import OpenBook from "./icons/Book";

const ReadingCardStyle = styled(Card)`
  & svg {
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
};

const ReadingCard = ({ reading, totalPages }: Props) => {
  return (
    <ReadingCardStyle>
      <OpenBook />
      <h4>{formatDate(reading.createdAt)}</h4>
      <p>
        Page <strong>{reading.progress}</strong>
        {totalPages ? ` out of ${totalPages}` : null}
      </p>
      <p>{getReadingTimeString(reading.timeRemainingInSeconds)} to go</p>
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
