import {rule, shield, or} from 'graphql-shield'
import logger from 'loglevel'

function getPermissions(user) {
  return user.role
}

const isAuthenticated = rule()((parent, args, {me}) => {
  return me !== undefined && me !== null
})

const canReadAllData = rule()((parent, args, {me}) => {
  const role = getPermissions(me)
  return role === 'ADMIN'
})

const isReadingOwnUser = rule()((parent, {id}, {me}) => {
  return me && me.id.toString() === id.toString()
})

const isReadingOwnBookshelf = rule()(
  async (parent, {bookshelfId}, {me, models}) => {
    const bs = await models.BookShelf.findByPk(bookshelfId)
    return me && me.id.toString() === bs.userId.toString()
  },
)

// Run in debug mode when not in production to receive more accurate errors
const permissions = shield(
  {
    Query: {
      user: or(isReadingOwnUser, canReadAllData),
      users: canReadAllData,

      bookshelves: canReadAllData,
      bookshelf: or(isReadingOwnBookshelf, canReadAllData),
      mybookshelves: isAuthenticated,
    },
    Mutation: {
      createAuthor: canReadAllData,
      addBook: isReadingOwnBookshelf,

      updateUser: isReadingOwnUser,
    },
  },
  {
    debug: process.env.NODE_ENV === 'production' ? false : true,
  },
)

export {
  permissions,
  isAuthenticated,
  canReadAllData,
  isReadingOwnUser,
  getPermissions,
  isReadingOwnBookshelf,
}
