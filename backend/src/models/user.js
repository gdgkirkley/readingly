import {Model} from 'sequelize'
import {getSaltAndHash} from '../utils/auth'

const user = (sequelize, DataTypes) => {
  class User extends Model {
    static async findByLogin(login) {
      let user = await User.findOne({
        where: {username: login},
      })

      if (!user) {
        user = await User.findOne({
          where: {email: login},
        })
      }

      return user
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [7, 42],
        },
      },
      salt: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'user',
    },
  )

  User.beforeCreate(async user => {
    const {salt, hash} = getSaltAndHash(user.password)
    user.password = hash
    user.salt = salt
  })

  return User
}

export default user
