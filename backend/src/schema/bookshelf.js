import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    bookshelves: [BookShelf!]
    bookshelf(id: ID!): BookShelf
    mybookshelves: [BookShelf!]
  }

  extend type Mutation {
    createBookshelf(title: String!): BookShelf
    addBook(googleBookId: String!, bookshelfId: ID!): BookShelf
  }

  type BookShelf {
    id: ID!
    title: String!
    createdAt: DateTime!
    user: User!
    books: [Book!]
    bookCount: Int!
  }
`
