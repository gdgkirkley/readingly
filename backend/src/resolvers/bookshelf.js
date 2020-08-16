import logger from 'loglevel'
import {QueryTypes} from 'sequelize'
import {sequelize} from '../models'
import {getGoogleBook} from '../utils/googleBooks'
import {
  AVERAGE_READING_WORDS_PER_MINUTE,
  AVERAGE_WORDS_PER_PAGE,
} from '../utils/constants'

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
    mybookshelf: async (parent, {title}, {me, models}) => {
      return await models.BookShelf.findOne({
        where: {
          userId: me.id,
          title,
        },
      })
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
    removeBook: async (parent, {googleBooksId, bookshelfId}, {models}) => {
      const bookshelf = await models.BookShelf.findByPk(bookshelfId)

      if (!bookshelf) {
        return null
      }

      const book = await models.Book.findOne({
        where: {
          googleBooksId,
        },
      })

      if (!book) {
        return null
      }

      if (await bookshelf.hasBook(book)) {
        bookshelf.removeBook(book)
      } else {
        throw new Error('This book is not on this bookshelf!')
      }

      return bookshelf
    },
  },

  BookShelf: {
    user: async (bookshelf, args, {models}) => {
      return await models.User.findByPk(bookshelf.userId)
    },

    books: async (bookshelf, {limit, offset}, {models}) => {
      return await bookshelf.getBooks({
        limit: limit ? limit : 50,
        offset: offset ? offset : 0,
      })
    },

    bookCount: async (bookshelf, args, {models}) => {
      return await bookshelf.countBooks()
    },

    averageTimeToReadInSeconds: async (bookshelf, args, {models}) => {
      const [count] = await sequelize.query(
        `
        SELECT SUM(books."pageCount") AS totalPageCount
        FROM books
        LEFT JOIN bookshelfbook on books."googleBooksId" = bookshelfbook."bookGoogleBooksId"
        WHERE bookshelfbook."bookshelfId" = '${bookshelf.id}'
      `,
        {type: QueryTypes.SELECT},
      )

      if (!count.totalpagecount) {
        return 0
      }

      const pageCount = parseInt(count.totalpagecount)

      const estimatedWords = pageCount * AVERAGE_WORDS_PER_PAGE

      const totalReadingTimeSeconds =
        estimatedWords / (AVERAGE_READING_WORDS_PER_MINUTE / 60)

      return totalReadingTimeSeconds
    },

    goal: async (bookshelf, args, {models, me}) => {
      if (!me) return null

      return await models.Goal.findOne({
        where: {
          goalableId: bookshelf.id,
          userId: me.id,
        },
      })
    },
  },
}
