import {DateResolver, DateTimeResolver} from 'graphql-scalars'

import userResolvers from './user'
import bookResolvers from './book'
import bookshelfResolvers from './bookshelf'
import authorResolvers from './author'
import readingResolvers from './reading'

const rootResolver = {
  Date: DateResolver,
  DateTime: DateTimeResolver,
}

export default [
  rootResolver,
  userResolvers,
  bookResolvers,
  bookshelfResolvers,
  authorResolvers,
  readingResolvers,
]
