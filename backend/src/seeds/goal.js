import models from '../models'

async function createGoals() {
  const book = await models.Book.findByPk('s1gVAAAAYAAJ')
  await book.createGoal({goalDate: '2020-09-30', userId: 1})

  const bookshelves = await models.BookShelf.findAll({
    where: {
      userId: 1,
    },
  })

  await bookshelves[0].createGoal({goalDate: '2020-12-31', userId: 1})
}

export default createGoals
