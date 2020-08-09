import React from "react";
import { Reading } from "../graphql/reading";
import { formatDate } from "../lib/formatDates";

type Props = {
  reading: Reading;
  totalPages?: number;
};

const ReadingCard = ({ reading, totalPages }: Props) => {
  return (
    <div>
      {formatDate(reading.createdAt)} | Page {reading.progress}{" "}
      {totalPages
        ? `out of ${totalPages} | ${getPercentage(
            reading.progress,
            totalPages
          )}%`
        : null}
    </div>
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
