import {rule, shield, or, and} from 'graphql-shield'
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

    if (!bs) {
      throw new Error('Invalid bookshelf ID')
    }

    return me && me.id.toString() === bs.userId.toString()
  },
)

const isAccessingOwnReading = rule()(async (parent, {id}, {me, models}) => {
  const r = await models.Reading.findByPk(id)

  if (!r) {
    throw new Error('Invalid Reading ID')
  }

  return me && me.id.toString() === r.userId.toString()
})

const isAccessingOwnGoal = rule()(async (parent, {id}, {me, models}) => {
  const g = await models.Goal.findByPk(id)

  return me.id.toString() === g?.userId.toString()
})

// Run in debug mode when not in production to receive more accurate errors
const permissions = shield(
  {
    Query: {
      user: or(isReadingOwnUser, canReadAllData),
      users: canReadAllData,

      bookshelves: canReadAllData,
      bookshelf: or(isReadingOwnBookshelf, canReadAllData),
      mybookshelves: isAuthenticated,

      readings: isAuthenticated,
      reading: and(isAuthenticated, isAccessingOwnReading),
      bookReadings: isAuthenticated,

      goals: isAuthenticated,
      goal: and(isAuthenticated, isAccessingOwnGoal),
    },
    Mutation: {
      createAuthor: canReadAllData,
      updateBookshelf: isReadingOwnBookshelf,
      deleteBookshelf: isReadingOwnBookshelf,
      addBook: isReadingOwnBookshelf,

      updateUser: and(isAuthenticated, isReadingOwnUser),

      createReading: isAuthenticated,
      updateReading: and(isAuthenticated, isAccessingOwnReading),
      deleteReading: and(isAuthenticated, isAccessingOwnReading),

      createGoal: isAuthenticated,
      updateGoal: and(isAuthenticated, isAccessingOwnGoal),
      deleteGoal: and(isAuthenticated, isAccessingOwnGoal),
    },
  },
  {
    debug: true,
  },
)

export {
  permissions,
  isAuthenticated,
  canReadAllData,
  isReadingOwnUser,
  getPermissions,
  isReadingOwnBookshelf,
  isAccessingOwnGoal,
  isAccessingOwnReading,
}
