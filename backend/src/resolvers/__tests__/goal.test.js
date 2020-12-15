import goal, {getDaysUntilDate} from '../goal'
import models from '../../models'
import book from '../book'
import bookshelf from '../bookshelf'

const parent = {}
const context = {me: {id: 1}, models}

const prideAndPrejudiceId = 's1gVAAAAYAAJ'

test('goals returns a list of goals', async () => {
  const goals = await goal.Query.goals(parent, {}, context)

  expect(goals).toHaveLength(2)
  expect(goals).toEqual(
    expect.arrayContaining([expect.objectContaining({goalableType: 'BOOK'})]),
  )
  expect(goals).toEqual(
    expect.arrayContaining([
      expect.objectContaining({goalableType: 'BOOKSHELF'}),
    ]),
  )
})

test('goals returns a list of goals if filtered', async () => {
  const goals = await goal.Query.goals(parent, {status: 'INPROGRESS'}, context)

  expect(goals).toHaveLength(2)
  expect(goals).toEqual(
    expect.arrayContaining([
      expect.objectContaining({goalableType: 'BOOK', status: 'INPROGRESS'}),
    ]),
  )
  expect(goals).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        goalableType: 'BOOKSHELF',
        status: 'INPROGRESS',
      }),
    ]),
  )
})

test('goal returns a goal', async () => {
  const goals = await goal.Query.goals(parent, {}, context)

  const queriedGoal = await goal.Query.goal(parent, {id: goals[0].id}, context)

  expect(queriedGoal).toStrictEqual(goals[0])
})

test('goal returns an error for no found goal', async () => {
  await expect(goal.Query.goal(parent, {id: 1235}, context)).rejects.toThrow(
    /no goal/i,
  )
})

test('goal returns goalable', async () => {
  const goals = await goal.Query.goals(parent, {}, context)

  const goalable = await goal.Goal.goalable(goals[0], {}, context)

  expect(goalable.googleBooksId).toBe(prideAndPrejudiceId)
  expect(goalable.title).toBe('Pride and Prejudice')

  const goalable2 = await goal.Goal.goalable(goals[1], {}, context)

  expect(goalable2.title).toBe('Favourites')
})

test('createGoal can create a goal for a book', async () => {
  // delete seed data just for this test
  await goal.Mutation.deleteGoal(parent, {id: 1}, context)

  const b = await book.Query.book(
    parent,
    {googleBooksId: prideAndPrejudiceId},
    context,
  )

  const createdGoal = await goal.Mutation.createGoal(
    parent,
    {goalDate: '2020-12-31', goalableId: b.googleBooksId},
    context,
  )

  expect(createdGoal.goalDate).toMatchInlineSnapshot(`2020-12-31T00:00:00.000Z`)
  expect(createdGoal.goalableType).toBe('BOOK')
  expect(createdGoal.status).toBe('NOTSTARTED')
})

test('createGoal can create a goal for a bookshelf', async () => {
  // delete seed data just for this test
  await goal.Mutation.deleteGoal(parent, {id: 2}, context)

  const bookshelves = await bookshelf.Query.bookshelves(parent, {}, context)

  const createdGoal = await goal.Mutation.createGoal(
    parent,
    {goalDate: '2021-08-15', goalableId: bookshelves[0].id},
    context,
  )

  expect(createdGoal.goalDate).toMatchInlineSnapshot(`2021-08-15T00:00:00.000Z`)
  expect(createdGoal.goalableType).toBe('BOOKSHELF')
  expect(createdGoal.status).toBe('NOTSTARTED')
})

test('createGoal can create goal with start date and status', async () => {
  const today = new Date()

  // delete seed data just for this test
  await goal.Mutation.deleteGoal(parent, {id: 2}, context)

  const bookshelves = await bookshelf.Query.bookshelves(parent, {}, context)

  const createdGoal = await goal.Mutation.createGoal(
    parent,
    {
      goalDate: '2021-08-15',
      startDate: today,
      status: 'INPROGRESS',
      goalableId: bookshelves[0].id,
    },
    context,
  )

  expect(createdGoal.goalDate).toMatchInlineSnapshot(`2021-08-15T00:00:00.000Z`)
  expect(createdGoal.goalableType).toBe('BOOKSHELF')
  expect(new Date(createdGoal.startDate)).toEqual(today)
  expect(createdGoal.status).toBe('INPROGRESS')
})

test('createGoal returns an error for invalid ID', async () => {
  await expect(
    goal.Mutation.createGoal(
      parent,
      {goalDate: '2020-08-15', goalableId: '1'},
      context,
    ),
  ).rejects.toThrow(/invalid id/i)
})

test('createGoal does not allow multiple goals', async () => {
  await expect(
    goal.Mutation.createGoal(
      parent,
      {
        goalDate: '2020-08-15',
        goalableId: prideAndPrejudiceId,
      },
      context,
    ),
  ).rejects.toThrow(/you already have a goal/i)
})

test('updateGoal can update a goal', async () => {
  const g = await goal.Mutation.updateGoal(
    parent,
    {id: 1, goalDate: '2020-10-18'},
    context,
  )

  expect(g.goalDate).toMatchInlineSnapshot(`2020-10-18T00:00:00.000Z`)

  const goalTest = await goal.Query.goal(parent, {id: g.id}, context)

  expect(goalTest.goalDate).toStrictEqual(g.goalDate)
})

test('updateGoal rejects an invalid goal id', async () => {
  await expect(
    goal.Mutation.updateGoal(
      parent,
      {id: 123, goalDate: '2020-08-15'},
      context,
    ),
  ).rejects.toThrow(/no goal/i)
})

test('deleteGoal deletes a goal', async () => {
  const message = await goal.Mutation.deleteGoal(parent, {id: 1}, context)

  expect(message.message).toMatch(/goal deleted/i)
})

test('deleteGoal rejects invalid goal id', async () => {
  await expect(
    goal.Mutation.deleteGoal(parent, {id: 123}, context),
  ).rejects.toThrow(/no goal/i)
})

test('reading recommendation returns value for book', async () => {
  const goalParent = await models.Goal.findByPk(1)
  const g = await goal.Goal.readingRecommendation(goalParent, {}, context)

  expect(g).toBeGreaterThan(0)
})

test('reading recommendation returns value for bookshelf', async () => {
  const goalParent = await models.Goal.findByPk(2)
  const book = await models.Book.findByPk('s1gVAAAAYAAJ')
  const bookshelf = await models.BookShelf.findOne({
    where: {
      userId: 1,
    },
  })
  await bookshelf.addBook(book)
  const g = await goal.Goal.readingRecommendation(goalParent, {}, context)

  expect(g).toBeGreaterThan(0)
})
