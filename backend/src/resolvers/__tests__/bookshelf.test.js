import bookshelf from '../bookshelf'
import models from '../../models'

const parent = {}
const context = {me: {id: 1}, models}

test('bookshelf returns goal', async () => {
  const shelf = await models.BookShelf.findOne({
    where: {
      userId: 1,
    },
  })
  const goal = await bookshelf.BookShelf.goal(shelf, {}, context)

  expect(goal.goalableId).toBe(shelf.id)
  expect(goal.goalableType).toBe('BOOKSHELF')
})

test("bookshelf does not return another user's bookshelf", async () => {
  const shelf = await models.BookShelf.findOne({
    where: {
      userId: 1,
    },
  })
  const goal = await bookshelf.BookShelf.goal(shelf, {}, {me: {id: 2}, models})

  expect(goal).toBe(null)
})

test('bookshelf returns null if no user', async () => {
  const shelf = await models.BookShelf.findOne({
    where: {
      userId: 1,
    },
  })
  const goal = await bookshelf.BookShelf.goal(shelf, {}, {models, me: null})

  expect(goal).toBe(null)
})
