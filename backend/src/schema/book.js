import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    books: [Book!]
    book(id: ID!): Book
  }

  extend type Mutation {
    searchBook(search: String!): [Book!]
  }

  type Book {
    id: ID!
    googleBooksId: String!
    title: String!
    description: String
    thumbnail: String
    pageCount: Int!
    publishDate: String
  }
`
