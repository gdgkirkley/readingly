import {gql} from 'apollo-server-express'

const schema = gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(username: String!, email: String!, password: String!): User!
    signIn(login: String!, password: String!): User!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    bookshelves: [BookShelf!]
  }
`

export default schema
