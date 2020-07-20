import express from 'express'
import logger from 'loglevel'
import {ApolloServer} from 'apollo-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import {applyMiddleware} from 'graphql-middleware'
import errorMiddleware from './middleware/Error'
import typeDefs from './schema'
import resolvers from './resolvers'
import models, {sequelize} from './models'
import {createUsers, createBooks, createBookshelves} from './seeds'
import {authMiddleware} from './utils/auth'
import {permissions} from './utils/permission'

async function startServer({port = process.env.PORT} = {}) {
  const app = express()

  app.use(errorMiddleware)
  app.use(authMiddleware)

  const schema = applyMiddleware(
    makeExecutableSchema({typeDefs, resolvers}),
    permissions,
  )

  const server = new ApolloServer({
    schema,
    context: ({req}) => ({
      models,
      me: req.user,
    }),
  })

  server.applyMiddleware({app, path: '/graphql'})

  const seed = process.env.SEED_DATABASE || process.env.NODE_ENV === 'test'

  await sequelize.sync({
    force: seed,
  })

  if (seed) {
    logger.info('Seeding database')
    await createUsers()
    await createBooks()
    await createBookshelves()
  }

  app.listen({port: port}, () => {
    logger.info(`Listening on port ${port}`)
  })
}

export {startServer}
