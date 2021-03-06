import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import logger from 'loglevel'
import {ApolloServer} from 'apollo-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import {applyMiddleware} from 'graphql-middleware'
import {corsOrigins} from './cors'
import errorMiddleware from './middleware/Error'
import typeDefs from './schema'
import resolvers from './resolvers'
import models from './models'
import {authMiddleware} from './utils/auth'
import {permissions} from './permission'

async function startServer({port = process.env.PORT} = {}) {
  const app = express()

  app.use(cors(corsOrigins()))
  app.use(cookieParser())
  app.use(errorMiddleware)
  app.use(authMiddleware)

  const schema = applyMiddleware(
    makeExecutableSchema({typeDefs, resolvers}),
    permissions,
  )

  const server = new ApolloServer({
    schema,
    context: ({req, res}) => ({
      models,
      me: req.user,
      res,
    }),
  })

  server.applyMiddleware({
    app,
    cors: corsOrigins(),
  })
  server.applyMiddleware({app, path: '/graphql'})

  app.listen({port: port}, () => {
    logger.info(`Listening on port ${port}`)
  })
}

export {startServer}
