import author from '../author'
import models from '../../models'
import bookshelf from '../bookshelf'

const parent = {}
const context = {me: {id: 1}, models}

const validBookId = 's1gVAAAAYAAJ'

test('authors returns an array of authors', async () => {
  await models.Author.create({name: 'Jane Austen'})

  const authors = await author.Query.authors(parent, {}, context)

  expect(authors).toHaveLength(1)
})

test('author returns a specific author', async () => {
  const author1 = await models.Author.create({name: 'Jane Austen'})
  const author2 = await models.Author.create({name: 'J.R.R. Tolkein'})

  const a = await author.Query.author(parent, {id: author1.id}, context)
  const b = await author.Query.author(parent, {id: author2.id}, context)

  expect(a.name).toBe('Jane Austen')
  expect(b.name).toBe('J.R.R. Tolkein')
})

test('createAuthor creates an author', async () => {
  const createdAuthor = await author.Mutation.createAuthor(
    parent,
    {name: 'Jane Austen'},
    context,
  )

  expect(createdAuthor.name).toBe('Jane Austen')
})

test("createAuthor doesn't accept null value", async () => {
  await expect(
    author.Mutation.createAuthor(parent, {name: null}, context),
  ).rejects.toThrow(/invalid author name/i)
})

test("createAuthor doesn't accept empty value", async () => {
  await expect(
    author.Mutation.createAuthor(parent, {name: null}, context),
  ).rejects.toThrow(/invalid author name/i)
})

test('author can query associated books', async () => {
  const author1 = await models.Author.create({name: 'Jane Austen'})
  const book = await models.Book.findByPk(validBookId)

  author1.addBook(book)

  const books = await author.Author.books(author1, {}, context)

  expect(books).toHaveLength(1)
  expect(books[0].googleBooksId).toBe(validBookId)
})
