import {Model, DataTypes} from 'sequelize'

class Book extends Model {}

const book = sequelize => {
  Book.init(
    {
      googleBooksId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      pageCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      publishDate: {
        type: DataTypes.STRING,
      },
      publisher: {
        type: DataTypes.STRING,
      },
      averageRating: {
        type: DataTypes.FLOAT,
      },
      categories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'book',
    },
  )

  Book.associate = models => {
    Book.belongsToMany(models.Author, {through: 'bookauthor'})
    Book.belongsToMany(models.BookShelf, {through: 'bookshelfbook'})
  }

  return Book
}

export default book

export {Book}
