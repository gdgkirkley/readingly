import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    bookshelves: [BookShelf!]
    bookshelf(id: ID!): BookShelf
    mybookshelves: [BookShelf!]
  }

  extend type Mutation {
    createBookshelf(title: String!): BookShelf
    addBook(bookId: Int!, bookshelfId: Int!): BookShelf
  }

  type BookShelf {
    title: String!
    createdAt: String!
    user: User!
    books: [Book!]
    bookCount: Int!
  }
`
