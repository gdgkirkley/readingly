import Sequelize, {DataTypes} from 'sequelize'
import logger from 'loglevel'
import user from './user'
import book from './book'
import bookshelf from './bookshelf'
import author from './author'

const isTest = process.env.NODE_ENV === 'test'

const db = isTest ? process.env.TEST_DATABASE : process.env.DATABASE

logger.info('Connecting to ' + (isTest ? 'test' : 'dev') + 'db')

const sequelize = new Sequelize(
  db,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
    logging: msg =>
      process.env.NODE_ENV === 'production' ? false : logger.debug(msg),
  },
)

const models = {
  User: user(sequelize, DataTypes),
  Book: book(sequelize, DataTypes),
  BookShelf: bookshelf(sequelize),
  Author: author(sequelize),
}

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
})

export {sequelize}

export default models
