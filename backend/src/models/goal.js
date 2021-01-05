import {Model, DataTypes} from 'sequelize'
import {Book} from './book'
import {BookShelf} from './bookshelf'

/*
  Goal has a polymorphic association so that it can be applied to
  either a Book or BookShelf. This class uses Sequelize features to
  apply that through a consistent API under "goalable".

  To add a new type, it has to be associated in the enum, and in the addHook.
*/
class Goal extends Model {
  getGoalable(options) {
    if (!this.goalableType) return Promise.resolve(null)
    const lowerCaseType = this.goalableType.toLowerCase()
    const mixinMethodName = `get${uppercaseFirst(lowerCaseType)}`
    return this[mixinMethodName](options)
  }
}

const goal = sequelize => {
  Goal.init(
    {
      goalDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      goalableId: DataTypes.STRING,
      goalableType: DataTypes.ENUM('BOOK', 'BOOKSHELF'),
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('NOTSTARTED', 'INPROGRESS', 'COMPLETE'),
        defaultValue: 'NOTSTARTED',
        allowNull: false,
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
      modelName: 'goal',
    },
  )

  // See https://sequelize.org/master/manual/polymorphic-associations.html
  Goal.associate = model => {
    Goal.belongsTo(model.User)
    Goal.belongsTo(model.Book, {foreignKey: 'goalableId', constraints: false})
    Goal.belongsTo(model.BookShelf, {
      foreignKey: 'goalableId',
      constraints: false,
    })
  }

  Goal.addHook('afterFind', findResult => {
    if (!Array.isArray(findResult)) findResult = [findResult]
    for (const instance of findResult) {
      if (!instance) break

      if (instance.goalableType === 'BOOK' && instance.book !== undefined) {
        instance.goalable = instance.book
      } else if (
        instance.goalableType === 'BOOKSHELF' &&
        instance.bookshelf !== undefined
      ) {
        instance.goalable = instance.bookshelf
      }
      // Delete found values to prevent mistakes:
      delete instance.book
      delete instance.dataValues.book
      delete instance.bookshelf
      delete instance.dataValues.bookshelf
    }
  })

  return Goal
}

const uppercaseFirst = str => `${str[0].toUpperCase()}${str.substr(1)}`

export default goal

export {Goal}
