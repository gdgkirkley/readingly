import {Model, DataTypes, Sequelize} from 'sequelize'
import {User} from './user'
import {Book} from './book'

class BookShelf extends Model {}

const bookshelf = sequelize => {
  BookShelf.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
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
