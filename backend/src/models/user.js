import {Model} from 'sequelize'

const user = (sequelize, DataTypes) => {
  class User extends Model {
    findByLogin = async login => {
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
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'user',
    },
  )

  return User
}

export default user
