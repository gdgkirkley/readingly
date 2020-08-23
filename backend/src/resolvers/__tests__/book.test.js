import book from '../book'
import models from '../../models'
import bookshelf from '../bookshelf'

const parent = {}
const context = {me: {id: 1}, models}

const validBookId = 's1gVAAAAYAAJ'

test('books query returns an array of books', async () => {
  const books = await book.Query.books(parent, {}, context)

  expect(books).toHaveLength(1)
})

test('book query returns a single book', async () => {
  const b = await book.Query.book(parent, {googleBooksId: validBookId}, context)

  expect(b.googleBooksId).toBe(validBookId)
  expect(b.title).toBe('Pride and Prejudice')
})

test('googleBook query returns a book object', async () => {
  const b = await book.Query.googleBook(
    parent,
    {googleBooksId: validBookId},
    context,
  )

  expect(b.title).toBe('Pride and Prejudice')
})

test('googleBook query handles invalid googleBooksId', async () => {
  await expect(
    book.Query.googleBook(parent, {googleBooksId: '123testte'}, context),
  ).rejects.toThrow(/unable to get book/i)
})

test('searchBook query returns book array', async () => {
  let limit = 8
  const offset = 0
  let results = await book.Query.searchBook(
    parent,
    {search: 'Pride and Prejudice', limit, offset},
    context,
  )

  expect(results).toHaveLength(limit)

  limit = 22

  results = await book.Query.searchBook(
    parent,
    {search: 'Pride and Prejudice', limit, offset},
    context,
  )

  expect(results).toHaveLength(limit)
})

test('searchBook thumbnail image returns https', async () => {
  let results = await book.Query.searchBook(
    parent,
    {search: 'Pride and Prejudice', limit: 1, offset: 0},
    context,
  )

  expect(results[0].thumbnail).toMatch(/https/i)
})

test('createBook mutation creates a book', async () => {
  const bookToCreate = {
    googleBooksId: 'VB7IAgAAQBAJ',
    title: 'Pillars of the Earth',
    description:
      'The “extraordinary . . . monumental masterpiece” (Booklist) that changed the course of Ken Follett’s already phenomenal career—and begins where its prequel, The Evening and the Morning, ended.',
    publishDate: '2010',
    thumbnail:
      'https://books.google.com/books/content?id=VB7IAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE701u7nSPUR0JFipJi-6q-cRgsclsnGKGLqz9_t328nosvqiiBSfQLV7GmqlZIT74byerNUEiur2JJaOL_h1k3OjctzxUqno_3o5Cy0-EdYL4Kc5ijssfttKxb-bfODVYWKo-IHh&source=gbs_api',
    pageCount: 1008,
    averageRating: 4,
    publisher: 'Penguin',
  }

  const b = await book.Mutation.createBook(parent, bookToCreate, context)

  expect(b.googleBooksId).toStrictEqual(bookToCreate.googleBooksId)
})

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
