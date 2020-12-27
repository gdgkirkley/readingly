import {gql} from 'apollo-server-express'

import userSchema from './user'
import bookSchema from './book'
import bookshelfSchema from './bookshelf'
import authorSchema from './author'
import readingSchema from './reading'
import goalSchema from './goal'
import noteSchema from './note'

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

export default [
  linkSchema,
  userSchema,
  bookSchema,
  bookshelfSchema,
  authorSchema,
  readingSchema,
  goalSchema,
  noteSchema,
]
