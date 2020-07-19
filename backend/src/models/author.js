import {Model, DataTypes} from 'sequelize'

class Author extends Model {}

const author = sequelize => {
  Author.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'author',
    },
  )

  Author.associate = models => {
    Author.belongsToMany(models.Book, {through: 'bookauthor'})
  }

  return Author
}

export default author

export {Author}
