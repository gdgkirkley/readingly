import {Model, DataTypes} from 'sequelize'
import {User} from './user'
import {Book} from './book'

class BookShelf extends Model {}

const bookshelf = sequelize => {
  BookShelf.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'bookshelf',
    },
  )

  BookShelf.associate = model => {
    BookShelf.belongsTo(model.User)
    BookShelf.belongsToMany(model.Book, {through: 'bookshelfbook'})
  }

  return BookShelf
}

export default bookshelf

export {BookShelf}
