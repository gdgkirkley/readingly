import {Model, DataTypes, QueryTypes} from 'sequelize'
import {sequelize} from './index'

class BookShelf extends Model {
  async getTotalPagesOnShelf() {
    const [count] = await sequelize.query(
      `
      SELECT SUM(books."pageCount") AS totalPageCount
      FROM books
      LEFT JOIN bookshelfbook on books."googleBooksId" = bookshelfbook."bookGoogleBooksId"
      WHERE bookshelfbook."bookshelfId" = '${this.id}'
    `,
      {type: QueryTypes.SELECT},
    )

    if (!count.totalpagecount) {
      return 0
    } else {
      return count.totalpagecount
    }
  }
}

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
      privacyId: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        references: {
          model: {
            tableName: 'privacy',
          },
          key: 'id',
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
