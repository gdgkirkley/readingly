import React from "react";
import styled from "styled-components";
import { Goal, GoalStatus } from "../../../graphql/goal";
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

type Props = {
  title: string;
  goal: Goal;
  short?: boolean;
};

const DisplayProperties = [
  {
    key: "goalDate",
    text: "Reading Goal",
    icon: GoalIcon,
    function: formatDate,
    mustHaveStatus: null,
  },
  {
    key: "readingRecommendationSeconds",
    text: "Today's Reading Time Recommendation",
    icon: BookReader,
    function: getReadingTimeString,
    mustHaveStatus: GoalStatus.InProgress,
  },
  {
    key: "startDate",
    text: "Start Date",
    icon: Hourglass,
    function: formatDate,
    mustHaveStatus: null,
  },
  {
    key: "endDate",
    text: "End Date",
    icon: HourglassEnd,
    function: formatDate,
    mustHaveStatus: GoalStatus.Complete,
  },
];

const GoalDisplay = ({ title, goal, short }: Props) => {
  function hasStatus(mustHaveStatus: GoalStatus): boolean {
    return mustHaveStatus ? mustHaveStatus === goal.status : true;
  }

  return (
    <GoalStyles>
      {DisplayProperties.map((property) => {
        return goal[property.key] && hasStatus(property.mustHaveStatus) ? (
          <RowStyle key={property.key}>
            <property.icon />
            <RowText data-testid={property.key}>
              {property.text}:{" "}
              <strong>{property.function(goal[property.key])}</strong>
            </RowText>
          </RowStyle>
        ) : null;
      })}
    </GoalStyles>
  );
};

export default GoalDisplay;
