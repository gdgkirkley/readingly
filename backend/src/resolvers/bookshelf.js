import logger from 'loglevel'
import {getGoogleBook} from '../utils/googleBooks'

export default {
  Query: {
    bookshelves: async (parent, args, {models}) => {
      return await models.BookShelf.findAll()
    },
    bookshelf: async (parent, {bookshelfId}, {models}) => {
      return await models.BookShelf.findByPk(bookshelfId)
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
    books: async (bookshelf, {limit, offset}, {models}) => {
      const bs = await models.BookShelf.findByPk(bookshelf.id)
      return await bs.getBooks({
        limit: limit ? limit : 50,
        offset: offset ? offset : 0,
      })
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
    updateBookshelf: async (parent, {bookshelfId, title}, {models}) => {
      await models.BookShelf.update(
        {title},
        {
          where: {
            id: bookshelfId,
          },
        },
      )

      return await models.BookShelf.findByPk(bookshelfId)
    },
    deleteBookshelf: async (parent, {bookshelfId}, {models}) => {
      await models.BookShelf.destroy({
        where: {
          id: bookshelfId,
        },
      })

      return {message: 'Bookshelf deleted'}
    },
    addBook: async (parent, {googleBookId, bookshelfId}, {models}) => {
      const bookshelf = await models.BookShelf.findByPk(bookshelfId)

      if (!bookshelf) {
        return null
      }

      let book

      // If book exists, then no need to fetch info
      book = await models.Book.findOne({
        where: {
          googleBooksId: googleBookId,
        },
      })

      if (!book) {
        const googleBook = await getGoogleBook(googleBookId)

        const info = googleBook.volumeInfo

        book = await models.Book.create({
          title: info.title,
          description: info.description,
          publishDate: info.publishedDate,
          googleBooksId: googleBook.id,
          thumbnail: info.imageLinks.thumbnail,
          pageCount: info.pageCount,
        })

        try {
          await info.authors.forEach(async name => {
            const [author] = await models.Author.findOrCreate({
              where: {
                name,
              },
            })

            await author.addBook(book)
          })
        } catch (error) {
          logger.error(error)
        }
      }

      if (!(await bookshelf.hasBook(book))) {
        await bookshelf.addBook(book)
      }

      return bookshelf
    },
  },
}
