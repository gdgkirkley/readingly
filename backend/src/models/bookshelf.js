import {Model, DataTypes, Sequelize} from 'sequelize'

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
    BookShelf.hasOne(model.Goal, {
      foreignKey: 'goalableId',
      constraints: false,
      scope: {
        goalableType: 'BOOKSHELF',
      },
    })
  }

  return BookShelf
}

export default bookshelf

export {BookShelf}
