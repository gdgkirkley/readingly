import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    goals: Goal
    goal(id: ID!): Goal
  }

  extend type Mutation {
    createGoal(goalDate: String!, goalableId: ID!): Goal!
    updateGoal(id: ID!, goalDate: String!): Goal!
    deleteGoal(id: ID!): Message
  }

  union Goalable = Book | BookShelf

  type Goal {
    id: ID!
    goalDate: Date!
    goalableId: ID!
    goalableType: String!
    goalable: Goalable!
  }
`
