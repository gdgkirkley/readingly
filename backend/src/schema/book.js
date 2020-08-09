import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    books: [Book!]
    book(googleBooksId: ID!): Book
    googleBook(googleBooksId: String!): Book
    searchBook(search: String!, limit: Int, offset: Int): [Book!]
  }

  extend type Mutation {
    createBook(
      googleBooksId: ID!
      title: String!
      description: String
      authors: [String!]
      thumbnail: String!
      pageCount: Int!
      publishDate: String
    ): Book!
    updateBook(
      googleBooksId: ID!
      title: String
      description: String
      authors: [String]
      thumbnail: String
      pageCount: Int
      publishDate: String
    ): Book!
  }

  type Book {
    googleBooksId: ID!
    title: String!
    description: String
    authors: [String!]
    reading: [Reading!]
    bookshelves: [BookShelf!]
    thumbnail: String
    pageCount: Int!
    publishDate: String
    publisher: String
    averageRating: Float
    categories: [String!]
    createdAt: DateTime
    updatedAt: DateTime
  }

  type GoogleBook {
    googleBooksId: String!
    title: String!
    description: String
    authors: [String!]
    thumbnail: String
    pageCount: Int!
    publishDate: String
  }
`
