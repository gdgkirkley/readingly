import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { Goal, GoalStatus, GOALS_QUERY, GoalType } from "../graphql/goal";
import Card from "./Card";
import { Book } from "../graphql/books";
import { getAuthorString } from "../lib/book";

const GoalReadingStyle = styled.div`
  display: grid;
  grid-template-columns: 2fr 10fr;
  justify-content: flex-start;
  align-items: center;
`;

const CurrentlyReading = () => {
  const { data, loading, error } = useQuery(GOALS_QUERY, {
    variables: { status: GoalStatus.InProgress, type: GoalType.Book },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Uh oh! {error.message}</p>;

  console.log(data);

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
                  <div>
                    {goalable.thumbnail && (
                      <img src={goalable.thumbnail} alt={goalable.title} />
                    )}
                  </div>
                  <div>
                    <h2>{goalable.title}</h2>
                    {goalable.authors?.length && (
                      <p>By {getAuthorString(goalable.authors)}</p>
                    )}
                  </div>
                </GoalReadingStyle>
              </Card>
            );
          })
        : null}
    </div>
  );
};

export default CurrentlyReading;
