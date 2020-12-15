import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    goals(status: String, type: String): [Goal]
    goal(id: ID!): Goal
  }

  extend type Mutation {
    createGoal(
      goalDate: String!
      goalableId: ID!
      startDate: String
      status: String
    ): Goal!
    updateGoal(
      id: ID!
      goalDate: String!
      startDate: String
      endDate: String
      status: String
    ): Goal!
    deleteGoal(id: ID!): Message
  }

  union Goalable = Book | BookShelf

  type Goal {
    id: ID!
    goalDate: Date!
    goalableId: ID!
    goalableType: String!
    readingRecommendation: Int
    readingRecommendationSeconds: Int
    goalable: Goalable!
    startDate: Date
    endDate: Date
    status: String!
    createdAt: Date!
    updatedAt: Date!
  }
`
