import {rule, shield} from 'graphql-shield'

const isAuthenticated = rule()((parent, args, {user}) => {
  return user !== undefined
})

const permissions = shield({
  Query: {
    me: isAuthenticated,
  },
})

export {permissions}
