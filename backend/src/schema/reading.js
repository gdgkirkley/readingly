import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    readings: [Reading!]
    reading(id: ID!): Reading!

    bookReadings(googleBooksId: ID!): [Reading!]
  }

  extend type Mutation {
    createReading(
      progress: Float!
      googleBooksId: ID!
      privacyId: Int
    ): Reading!
    updateReading(id: ID!, progress: Float!, privacyId: Int): Reading!
    deleteReading(id: ID!): Message!
  }

  type Reading {
    id: ID!
    progress: Float!
    timeRemainingInSeconds: Int!
    user: User!
    book: Book!
    privacyId: Int!
    privacyLevel: String
    createdAt: DateTime
    updatedAt: DateTime
  }
`
