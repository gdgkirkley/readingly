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

    addBook(googleBookId: String!, bookshelfId: ID!): BookShelf
  }

  type BookShelf {
    id: ID!
    title: String!
    createdAt: DateTime!
    user: User!
    books(limit: Int, offset: Int): [Book!]
    bookCount: Int!
  }
`
