import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    notes(googleBooksId: ID): [Note]!
    note(id: ID!): Note
  }

  extend type Mutation {
    createNote(note: String!, page: Int, googleBooksId: ID!): Note!
    updateNote(id: ID!, note: String!, page: Int): Note!
    deleteNote(id: ID!): Message
  }

  type Note {
    id: ID!
    note: String!
    page: Int
    book: Book
    user: User
    privacyId: Int!
    privacyLevel: String
    createdAt: Date!
    updatedAt: Date!
  }
`
