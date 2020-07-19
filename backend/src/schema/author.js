import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    authors: [Author!]
    author(id: ID!): Author!
  }

  extend type Mutation {
    createAuthor(name: String!): Author!
  }

  type Author {
    name: String!
    books: [Book!]
    createdAt: DateTime
    updatedAt: DateTime
  }
`
