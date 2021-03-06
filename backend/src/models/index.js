import Sequelize, {DataTypes} from 'sequelize'
import logger from 'loglevel'
import user from './user'
import book from './book'
import bookshelf from './bookshelf'
import author from './author'
import reading from './reading'
import goal from './goal'
import note from './note'

const db = process.env.DATABASE

let sequelize

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: msg =>
      process.env.NODE_ENV === 'production' ? false : logger.debug(msg),
  })
} else {
  sequelize = new Sequelize(
    db,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      dialect: 'postgres',
      dialectOptions: {
        useUTC: true,
      },
      logging: msg =>
        process.env.NODE_ENV === 'production' ? false : logger.debug(msg),
    },
  )
}

const models = {
  User: user(sequelize, DataTypes),
  Book: book(sequelize, DataTypes),
  BookShelf: bookshelf(sequelize),
  Author: author(sequelize),
  Reading: reading(sequelize),
  Goal: goal(sequelize),
  Note: note(sequelize),
}

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
})

export {sequelize}

export default models
