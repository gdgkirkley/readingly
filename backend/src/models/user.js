import {Model, DataTypes} from 'sequelize'
import {getSaltAndHash} from '../utils/auth'

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
const user = sequelize => {
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
      readingSpeedWordsPerMinute: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      salt: {
        type: DataTypes.TEXT,
      },
      role: {
        type: DataTypes.ENUM('ADMIN', 'USER'),
        defaultValue: 'USER',
        allowNull: false,
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

export {User}
