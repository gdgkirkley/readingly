import React from "react";
import { GoalStatus } from "../../../graphql/goal";
import { formatDate } from "../../../lib/formatDates";
import {
  getDateDiffInDays,
  getPeriodFromNow,
  getReadingTimeString,
  humanReadableTimeDiff,
} from "../../../lib/time";

const GoalDisplay = ({ title, goal }) => {
  const complete = goal.status === GoalStatus.Complete;

  return (
    <>
      <p data-testid="goalDate">
        My goal {complete ? "was" : "is"} to read {title} by{" "}
        <strong>{formatDate(goal.goalDate)}</strong>. That{" "}
        <span
          dangerouslySetInnerHTML={{
            __html: getPeriodFromNow(goal.goalDate),
          }}
        />
        .
      </p>
      {goal.status === GoalStatus.InProgress && goal.readingRecommendation ? (
        <p data-testid="readingRecommendation">
          To reach my goal, readingly recommends{" "}
          <strong>reading {goal.readingRecommendation} pages today</strong>
          {goal.readingRecommendationSeconds ? (
            <span>
              , which will take about{" "}
              <strong>
                {getReadingTimeString(goal.readingRecommendationSeconds)}
              </strong>
            </span>
          ) : null}
          !
        </p>
      ) : null}
      {goal.startDate ? (
        <p data-testid="startDate">
          I started reading on <strong>{formatDate(goal.startDate)}</strong>.
          That{" "}
          <span
            dangerouslySetInnerHTML={{
              __html: getPeriodFromNow(goal.startDate),
            }}
          />
          .{" "}
        </p>
      ) : null}
      {goal.endDate ? (
        <p>
          I finished reading on <strong>{formatDate(goal.endDate)}</strong>. It
          took me{" "}
          <strong>
            {humanReadableTimeDiff(
              new Date(goal.startDate),
              new Date(goal.endDate)
            )}
          </strong>{" "}
          to read.
        </p>
      ) : null}
    </>
  );
};

export default GoalDisplay;
