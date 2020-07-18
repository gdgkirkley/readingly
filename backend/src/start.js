import express from 'express'
import logger from 'loglevel'
import {ApolloServer} from 'apollo-server-express'
import errorMiddleware from './middleware/Error'
import schema from './schema'
import resolvers from './resolvers'
import models, {sequelize} from './models'
import createUsers from './seeds/user'

async function startServer({port = process.env.PORT} = {}) {
  const app = express()

  app.use(errorMiddleware)

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async () => ({
      models,
    }),
  })

  server.applyMiddleware({app, path: '/graphql'})

  await sequelize.sync({force: process.env.SEED_DATABASE})

  if (process.env.SEED_DATABASE) {
    logger.info('Seeding database')
    createUsers()
  }

  app.listen({port: port}, () => {
    logger.info(`Listening on port ${port}`)
  })
}

export {startServer}
