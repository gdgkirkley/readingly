import {Model, DataTypes} from 'sequelize'
import {Book} from './book'
import {BookShelf} from './bookshelf'

/*
  Goal has a polymorphic association so that it can be applied to
  either a Book or BookShelf. This class uses Sequelize features to
  apply that through a consistent API under "goalable".
*/
class Goal extends Model {
  getGoalable(options) {
    if (!this.goalableType) return Promise.resolve(null)
    const mixinMethodName = `get${uppercaseFirst(this.goalableType)}`
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
      if (instance.goalableType === 'BOOK' && instance.book !== undefined) {
        instance.goalable = instance.book
      } else if (
        instance.goalableType === 'BOOKSHELF' &&
        instance.bookshelf !== undefined
      ) {
        instance.goalable = instance.bookshelf
      }
      // To prevent mistakes:
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
