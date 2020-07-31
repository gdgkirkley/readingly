import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    books: [Book!]
    book(id: ID!): Book
    googleBook(googleBooksId: String!): GoogleBook
    searchBook(search: String!, limit: Int, offset: Int): [Book!]
  }

  extend type Mutation {
    createBook(
      title: String!
      description: String
      googleBooksId: String!
      authors: [String!]
      thumbnail: String!
      pageCount: Int!
      publishDate: String
    ): Book!
    updateBook(
      id: ID!
      title: String
      description: String
      authors: [String]
      thumbnail: String
      pageCount: Int
      publishDate: String
    ): Book!
  }

  type Book {
    id: ID!
    googleBooksId: String!
    title: String!
    description: String
    authors: [Author!]
    thumbnail: String
    pageCount: Int!
    publishDate: String
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
    categories: [String!]
  }
`
