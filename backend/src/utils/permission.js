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

const permissions = shield({
  Query: {
    user: or(isReadingOwnUser, canReadAllData),
    users: canReadAllData,
    me: isAuthenticated,

    bookshelves: canReadAllData,
    bookshelf: or(isReadingOwnBookshelf, canReadAllData),
    mybookshelves: isAuthenticated,
  },
  Mutation: {
    searchBook: isAuthenticated,
    createAuthor: canReadAllData,
  },
})

export {
  permissions,
  isAuthenticated,
  canReadAllData,
  isReadingOwnUser,
  getPermissions,
  isReadingOwnBookshelf,
}
