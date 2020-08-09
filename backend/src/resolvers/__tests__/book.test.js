import book from '../book'
import models from '../../models'

const parent = {}
const context = {me: {id: 1}, models}

test('book returns reading data', async () => {
  const b = await book.Query.book(parent, {id: 1}, context)

  let bookReading = await book.Book.reading(b, {}, context)

  expect(bookReading).toHaveLength(0)

  const createdReading = await models.Reading.create({
    bookId: b.id,
    userId: context.me.id,
    progress: 0.5,
  })

  bookReading = await book.Book.reading(b, {}, context)

  expect(bookReading).toHaveLength(1)
  expect(bookReading).toEqual(
    expect.arrayContaining([expect.objectContaining({id: createdReading.id})]),
  )
})

test('book reading data is null if no user', async () => {
  const b = await book.Query.book(parent, {id: 1}, context)

  const bookReading = await book.Book.reading(b, {}, {me: null, models})

  expect(bookReading).toBe(null)
})
