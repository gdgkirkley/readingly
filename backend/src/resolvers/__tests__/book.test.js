import book from '../book'
import models from '../../models'
import bookshelf from '../bookshelf'

const parent = {}
const context = {me: {id: 1}, models}

const validBookId = 's1gVAAAAYAAJ'

test('book returns reading data', async () => {
  const b = await book.Query.book(parent, {googleBooksId: validBookId}, context)

  let bookReading = await book.Book.reading(b, {}, context)

  // There is one reading row in seed data
  expect(bookReading).toHaveLength(1)

  const createdReading = await models.Reading.create({
    bookGoogleBooksId: b.googleBooksId,
    userId: context.me.id,
    progress: 0.5,
  })

  bookReading = await book.Book.reading(b, {}, context)

  expect(bookReading).toHaveLength(2)
  expect(bookReading).toEqual(
    expect.arrayContaining([expect.objectContaining({id: createdReading.id})]),
  )
})

test('book reading data is null if no user', async () => {
  const b = await book.Query.book(parent, {googleBooksId: validBookId}, context)

  const bookReading = await book.Book.reading(b, {}, {me: null, models})

  expect(bookReading).toBe(null)
})

test('book bookshelf data is null if no user', async () => {
  const b = await book.Query.book(parent, {googleBooksId: validBookId}, context)

  const bookReading = await book.Book.bookshelves(b, {}, {me: null, models})

  expect(bookReading).toBe(null)
})

test('book returns bookshelf data', async () => {
  const b = await book.Query.book(parent, {googleBooksId: validBookId}, context)

  let bookBookshelves = await book.Book.bookshelves(b, {}, context)

  expect(bookBookshelves).toHaveLength(0)

  const bs = await bookshelf.Query.mybookshelf(
    parent,
    {title: 'Favourites'},
    context,
  )

  await bs.addBook(b)

  bookBookshelves = await book.Book.bookshelves(b, {}, context)

  expect(bookBookshelves).toHaveLength(1)
  expect(bookBookshelves).toEqual(
    expect.arrayContaining([expect.objectContaining({id: bs.id})]),
  )
})

test('book returns book goal data', async () => {
  const b = await book.Query.book(parent, {googleBooksId: validBookId}, context)

  let goal = await book.Book.goal(b, {}, context)

  expect(goal.goalableType).toBe('BOOK')
  expect(goal.goalableId).toBe(b.googleBooksId)
})

test("book does not return another user's book goal data", async () => {
  const b = await book.Query.book(parent, {googleBooksId: validBookId}, context)

  let goal = await book.Book.goal(b, {}, {me: {id: 2}, models})

  expect(goal).toBe(null)
})

test('book goal returns null if no user', async () => {
  const b = await book.Query.book(parent, {googleBooksId: validBookId}, context)

  let goal = await book.Book.goal(b, {}, {models, me: null})

  expect(goal).toBe(null)
})
