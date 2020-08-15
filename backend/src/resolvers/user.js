import {AuthenticationError, UserInputError} from 'apollo-server'
import logger from 'loglevel'
import {getUserToken, isPasswordValid, getSaltAndHash} from '../utils/auth'

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
    signUp: async (parent, {username, email, password}, {models, res}) => {
      const user = await models.User.create({username, email, password})
      const token = await getUserToken(user)

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      })

      return user
    },

    signIn: async (parent, {login, password}, {models, res}) => {
      const user = await models.User.findByLogin(login)

      if (!user) {
        throw new UserInputError(`No user found for ${login}`)
      }

      const isValid = isPasswordValid(password, user.salt, user.password)

      if (!isValid) {
        throw new AuthenticationError('Invalid password')
      }

      const token = await getUserToken(user)

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      })

      return user
    },

    signout: async (parent, args, {res}) => {
      res.clearCookie('token')
      return {message: 'Goodbye!'}
    },

    updatePassword: async (
      parent,
      {login, oldPassword, newPassword},
      {models},
    ) => {
      const user = await models.User.findByLogin(login)

      if (!user) {
        throw new UserInputError(`No user found for ${login}`)
      }

      const isValid = isPasswordValid(oldPassword, user.salt, user.password)

      if (!isValid) {
        throw new AuthenticationError('Wrong password')
      }

      const {salt, hash} = getSaltAndHash(newPassword)

      user.password = hash
      user.salt = salt

      await user.save()

      return user
    },

    updateUser: async (parent, {id, ...rest}, {models}) => {
      await models.User.update(
        {
          ...rest,
        },
        {
          where: {
            id: id,
          },
        },
      )

      return await models.User.findByPk(id)
    },
  },
}
