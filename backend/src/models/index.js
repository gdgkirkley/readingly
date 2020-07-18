import Sequelize, {DataTypes} from 'sequelize'
import logger from 'loglevel'
import user from './user'

const sequelize = new Sequelize(
  process.env.DATABASE,
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
}

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
})

export {sequelize}

export default models
