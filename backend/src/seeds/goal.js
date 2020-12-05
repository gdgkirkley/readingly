import models from '../models'

async function createGoals() {
  const today = new Date()
  const goalDate = today.setDate(today.getDate() + 7)
  const bookshelfGoalDate = today.setDate(today.getDate() + 100)

  const book = await models.Book.findByPk('s1gVAAAAYAAJ')
  await book.createGoal({
    goalDate: goalDate,
    userId: 1,
    startDate: today,
    status: 'INPROGRESS',
  })

  const bookshelves = await models.BookShelf.findAll({
    where: {
      userId: 1,
    },
  })

  await bookshelves[0].createGoal({
    goalDate: bookshelfGoalDate,
    userId: 1,
    startDate: today,
    status: 'INPROGRESS',
  })
}

export default createGoals
