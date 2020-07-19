import {DateResolver, DateTimeResolver} from 'graphql-scalars'

import userResolvers from './user'
import bookResolvers from './book'
import bookshelfResolvers from './bookshelf'

const rootResolver = {
  Date: DateResolver,
  DateTime: DateTimeResolver,
}

export default [rootResolver, userResolvers, bookResolvers, bookshelfResolvers]
