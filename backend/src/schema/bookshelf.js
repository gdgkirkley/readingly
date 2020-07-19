import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    bookshelves: [BookShelf!]
    bookshelf(id: ID!): BookShelf
    mybookshelves: [BookShelf!]
  }

  extend type Mutation {
    createBookshelf(title: String!): BookShelf
    addBook(googleBookId: String!, bookshelfId: Int!): BookShelf
  }

  type BookShelf {
    title: String!
    createdAt: DateTime!
    user: User!
    books: [Book!]
    bookCount: Int!
  }
`
