import React from "react";
import { GoalStatus } from "../../../graphql/goal";
import { formatDate } from "../../../lib/formatDates";
import { getPeriodFromNow } from "../../../lib/time";

const GoalDisplay = ({ title, goal }) => {
  return (
    <>
      <p data-testid="goalDate">
        My goal is to read {title} by{" "}
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
          <strong>reading {goal.readingRecommendation} pages today!</strong>
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
          .
        </p>
      ) : null}
    </>
  );
};

export default GoalDisplay;
