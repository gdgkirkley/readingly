import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { Goal, GoalStatus, GOALS_QUERY, GoalType } from "../graphql/goal";
import Card from "./Card";
import { Book } from "../graphql/books";
import { getAuthorString } from "../lib/book";
import GoalDisplay from "./Goal/GoalDisplay";

const GoalReadingStyle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const GoalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;

  @media (min-width: 768px) {
    margin: 0 1rem;
  }
`;

const CurrentlyReading = () => {
  const { data, loading, error } = useQuery(GOALS_QUERY, {
    variables: { status: GoalStatus.InProgress, type: GoalType.Book },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Uh oh! {error.message}</p>;

  const goals = data.goals;

  return (
    <div>
      <h1>Currently Reading</h1>
      {goals?.length
        ? goals.map((goal: Goal) => {
            // We know it's a book because of the type query above
            let goalable: Book = goal.goalable as Book;
            return (
              <Card key={goal.id}>
                <GoalReadingStyle>
                  <GoalContent>
                    {goalable.thumbnail && (
                      <img src={goalable.thumbnail} alt={goalable.title} />
                    )}
                  </GoalContent>
                  <GoalContent>
                    <h2>{goalable.title}</h2>
                    {goalable.authors?.length && (
                      <p>By {getAuthorString(goalable.authors)}</p>
                    )}
                    <GoalDisplay
                      title={goalable.title}
                      goal={goal}
                      short={true}
                    />
                  </GoalContent>
                </GoalReadingStyle>
              </Card>
            );
          })
        : null}
    </div>
  );
};

export default CurrentlyReading;
