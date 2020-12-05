import React from "react";
import { GoalStatus } from "../../graphql/goal";
import { formatDate } from "../../lib/formatDates";
import { getPeriodFromNow } from "../../lib/time";

const GoalDisplay = ({ title, goal }) => {
  return (
    <>
      <p>
        My goal is to read {title} by{" "}
        <strong>{formatDate(goal.goalDate)}</strong>. That{" "}
        <span
          dangerouslySetInnerHTML={{
            __html: getPeriodFromNow(goal.goalDate),
          }}
        />
        .
      </p>
      {goal.status !== GoalStatus.Complete && goal.readingRecommendation ? (
        <p>
          To reach my goal, readingly recommends{" "}
          <strong>reading {goal.readingRecommendation} pages today!</strong>
        </p>
      ) : null}
      <p>
        I started reading on <strong>{formatDate(goal.startDate)}</strong>. That{" "}
        <span
          dangerouslySetInnerHTML={{
            __html: getPeriodFromNow(goal.startDate),
          }}
        />
        .
      </p>
    </>
  );
};

export default GoalDisplay;
