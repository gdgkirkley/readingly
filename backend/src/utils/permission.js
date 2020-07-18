import {rule, shield, or} from 'graphql-shield'
import logger from 'loglevel'

function getPermissions(user) {
  return user.role
}

const isAuthenticated = rule()((parent, args, {me}) => {
  return me !== undefined
})

const canReadAnyUser = rule()((parent, args, {me}) => {
  const role = getPermissions(me)
  return role === 'ADMIN'
})

const isReadingOwnUser = rule()((parent, {id}, {me}) => {
  return me && me.id.toString() === id.toString()
})

const permissions = shield({
  Query: {
    user: or(isReadingOwnUser, canReadAnyUser),
    users: canReadAnyUser,
    me: isAuthenticated,
  },
})

export {permissions}
