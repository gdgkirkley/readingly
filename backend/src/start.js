import express from 'express'
import logger from 'loglevel'
import {ApolloServer, gql} from 'apollo-server-express'
import errorMiddleware from './middleware/Error'

function startServer({port = process.env.PORT} = {}) {
  const app = express()

  app.use(errorMiddleware)

  const schema = gql`
    type Query {
      me: User
    }

    type User {
      username: String!
    }
  `

  const resolvers = {
    Query: {
      me: () => {
        return {
          username: 'Gabe Kirkley',
        }
      },
    },
  }

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
  })

  server.applyMiddleware({app, path: '/graphql'})

  app.listen({port: port}, () => {
    logger.info(`Listening on port ${port}`)
  })
}

export {startServer}
