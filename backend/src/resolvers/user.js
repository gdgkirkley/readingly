import {AuthenticationError, UserInputError} from 'apollo-server'
import logger from 'loglevel'
import {getUserToken, isPasswordValid} from '../utils/auth'

export default {
  Query: {
    users: async (parent, args, {models}) => {
      return await models.User.findAll()
    },
    user: async (parent, {id}, {models}) => {
      return await models.User.findByPk(id)
    },
    me: async (parent, args, {models, me}) => {
      if (!me || !me.id) {
        return null
      }
      return await models.User.findByPk(me.id)
    },
  },

  User: {
    bookshelves: async (user, args, {models}) => {
      return await models.BookShelf.findAll({
        where: {
          userId: user.id,
        },
      })
    },
  },

  Mutation: {
    signUp: async (parent, {username, email, password}, {models}) => {
      const user = await models.User.create({username, email, password})
      const token = await getUserToken(user)

      return {token}
    },

    signIn: async (parent, {login, password}, {models}) => {
      const user = await models.User.findByLogin(login)

      if (!user) {
        throw new UserInputError(`No user found for ${login}`)
      }

      const isValid = isPasswordValid(password, user.salt, user.password)

      if (!isValid) {
        throw new AuthenticationError('Invalid password')
      }

      const token = await getUserToken(user)
      return {token}
    },
  },
}
