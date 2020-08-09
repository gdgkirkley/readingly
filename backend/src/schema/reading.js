import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    readings: [Reading!]
    reading(id: ID!): Reading!

    bookReadings(googleBooksId: ID!): [Reading!]
  }

  extend type Mutation {
    createReading(progress: Float!, googleBooksId: ID!): Reading!
    updateReading(id: ID!, progress: Float!): Reading!
    deleteReading(id: ID!): Message!
  }

  type Reading {
    id: ID!
    progress: Float!
    user: User!
    book: Book!
    createdAt: DateTime
    updatedAt: DateTime
  }
`
