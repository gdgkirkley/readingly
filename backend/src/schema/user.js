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
    signout: Message!

    updatePassword(
      login: String!
      oldPassword: String!
      newPassword: String!
    ): User!

    updateUser(
      id: ID
      email: String
      username: String
      readingSpeedWordsPerMinute: Int
    ): User!
  }

  type Message {
    message: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    readingSpeedWordsPerMinute: Int!
    bookshelves: [BookShelf!]
  }
`

export default schema
