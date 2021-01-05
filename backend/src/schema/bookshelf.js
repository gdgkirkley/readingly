import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    bookshelves: [BookShelf!]
    bookshelf(bookshelfId: ID!): BookShelf
    mybookshelves: [BookShelf!]
    mybookshelf(title: String!): BookShelf!
  }

  extend type Mutation {
    createBookshelf(title: String!): BookShelf
    updateBookshelf(bookshelfId: ID!, title: String!): BookShelf
    deleteBookshelf(bookshelfId: ID!): Message

    addBook(googleBookId: ID!, bookshelfId: ID!): BookShelf
    removeBook(googleBooksId: ID!, bookshelfId: ID!): BookShelf
  }

  type BookShelf {
    id: ID!
    title: String!
    user: User!
    books(limit: Int, offset: Int, orderBy: String): [Book!]
    bookCount: Int!
    averageTimeToReadInSeconds: Int!
    goal: Goal
    privacyId: Int!
    privacyLevel: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`
