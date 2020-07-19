import {gql} from 'apollo-server-express'

import userSchema from './user'
import bookSchema from './book'
import bookshelfSchema from './bookshelf'

const linkSchema = gql`
  scalar Date
  scalar DateTime

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`

export default [linkSchema, userSchema, bookSchema, bookshelfSchema]
