import React from "react";
import styled from "styled-components";
import { GoalStatus } from "../../../graphql/goal";
import { formatDate } from "../../../lib/formatDates";
import {
  getDateDiffInDays,
  getPeriodFromNow,
  getReadingTimeString,
  humanReadableTimeDiff,
} from "../../../lib/time";
import BookReader from "../../icons/BookReader";
import GoalIcon from "../../icons/Goal";
import { Hourglass, HourglassEnd } from "../../icons/Hourglass";

const GoalStyles = styled.div`
  align-items: flex-start;

  & svg {
    width: 3rem;
  }

  @media (max-width: 768px) {
    & svg {
      width: 4rem;
    }
  }
`;

const RowStyle = styled.div`
  display: flex;
  margin-bottom: 2.5rem;
`;

const RowText = styled.div`
  margin-left: 2rem;
  font-size: 1.6rem;
  color: rgb(113, 113, 113);
`;

const RowHeader = styled.div`
  font-weight: 600;
  font-size: 1.8rem;
  color: ${(props) => props.theme.black};
`;

const GoalDisplay = ({ title, goal }) => {
  const complete = goal.status === GoalStatus.Complete;

  return (
    <GoalStyles>
      <RowStyle>
        <GoalIcon />
        <RowText data-testid="goalDate">
          <RowHeader>Goal</RowHeader>
          <div>
            My goal {complete ? "was" : "is"} to read {title} by{" "}
            <strong>{formatDate(goal.goalDate)}</strong>. That{" "}
            <span
              dangerouslySetInnerHTML={{
                __html: getPeriodFromNow(goal.goalDate),
              }}
            />
            .
          </div>
        </RowText>
      </RowStyle>
      {goal.status === GoalStatus.InProgress && goal.readingRecommendation ? (
        <RowStyle>
          <BookReader />
          <RowText data-testid="readingRecommendation">
            <RowHeader>Recommendation</RowHeader>
            <div>
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
            </div>
          </RowText>
        </RowStyle>
      ) : null}
      {goal.startDate ? (
        <RowStyle>
          <Hourglass />
          <RowText data-testid="startDate">
            <RowHeader>Start Date</RowHeader>I started reading on{" "}
            <strong>{formatDate(goal.startDate)}</strong>. That{" "}
            <span
              dangerouslySetInnerHTML={{
                __html: getPeriodFromNow(goal.startDate),
              }}
            />
            .{" "}
          </RowText>
        </RowStyle>
      ) : null}
      {goal.endDate ? (
        <RowStyle>
          <HourglassEnd />
          <RowText>
            <RowHeader>End Date</RowHeader>
            <div>
              I finished reading on <strong>{formatDate(goal.endDate)}</strong>.
              It took me{" "}
              <strong>
                {humanReadableTimeDiff(
                  new Date(goal.startDate),
                  new Date(goal.endDate)
                )}
              </strong>{" "}
              to read.
            </div>
          </RowText>
        </RowStyle>
      ) : null}
    </GoalStyles>
  );
};

export default GoalDisplay;
