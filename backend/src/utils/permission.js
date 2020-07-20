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

const permissions = shield({
  Query: {
    user: or(isReadingOwnUser, canReadAllData),
    users: canReadAllData,
    me: isAuthenticated,

    bookshelves: canReadAllData,
  },
  Mutation: {
    searchBook: isAuthenticated,
  },
})

export {
  permissions,
  isAuthenticated,
  canReadAllData,
  isReadingOwnUser,
  getPermissions,
}
