import {Model, DataTypes} from 'sequelize'
import {getSaltAndHash} from '../utils/auth'

class User extends Model {
  static async findByLogin(login) {
    const lowerLogin = login.toLowerCase()

    let user = await User.findOne({
      where: {username: login},
    })

    if (!user) {
      user = await User.findOne({
        where: {email: lowerLogin},
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
        unique: {
          msg: 'That username is already taken!',
        },
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          msg: 'That email is already taken!',
        },
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

  User.beforeValidate(user => {
    if (typeof user.email === 'string') {
      user.email = user.email.toLowerCase()
    }
  })

  User.beforeCreate(async user => {
    const {salt, hash} = getSaltAndHash(user.password)
    user.password = hash
    user.salt = salt
  })

  User.associate = models => {
    User.hasMany(models.Goal)
  }

  return User
}

export default user

export {User}
