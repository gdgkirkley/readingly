import logger from 'loglevel'
import {getGoogleBook} from '../utils/googleBooks'

export default {
  Query: {
    bookshelves: async (parent, args, {models}) => {
      return await models.BookShelf.findAll()
    },
    bookshelf: async (parent, {id}, {models}) => {
      return await models.BookShelf.findByPk(id)
    },
    mybookshelves: async (parent, args, {me, models}) => {
      return await models.BookShelf.findAll({
        where: {
          userId: me.id,
        },
      })
    },
  },

  BookShelf: {
    user: async (bookshelf, args, {models}) => {
      return await models.User.findByPk(bookshelf.userId)
    },
    books: async (bookshelf, args, {models}) => {
      const bs = await models.BookShelf.findByPk(bookshelf.id)
      return await bs.getBooks()
    },
    bookCount: async (bookshelf, args, {models}) => {
      const bs = await models.BookShelf.findByPk(bookshelf.id)
      return await bs.countBooks()
    },
  },

  Mutation: {
    createBookshelf: async (parent, {title}, {me, models}) => {
      return await models.BookShelf.create({title, userId: me.id})
    },
    addBook: async (parent, {googleBookId, bookshelfId}, {models}) => {
      const bookshelf = await models.BookShelf.findByPk(bookshelfId)

      if (!bookshelf) {
        return null
      }

      const googleBook = await getGoogleBook(googleBookId)

      const info = googleBook.volumeInfo

      const [book] = await models.Book.findOrCreate({
        where: {
          title: info.title,
          description: info.description,
          publishDate: info.publishedDate,
          googleBooksId: googleBook.id,
          thumbnail: info.imageLinks.thumbnail,
          pageCount: info.pageCount,
        },
      })

      logger.info(book)

      await bookshelf.addBook(book)
      return bookshelf
    },
  },
}
