import {Op} from 'sequelize'
import logger from 'loglevel'
import {getGoogleBooks, getGoogleBook} from '../utils/googleBooks'
import {
  AVERAGE_READING_WORDS_PER_MINUTE,
  AVERAGE_WORDS_PER_PAGE,
} from '../utils/constants'

export default {
  Query: {
    books: async (parent, args, {models}) => {
      return await models.Book.findAll()
    },

    book: async (parent, {googleBooksId}, {models}) => {
      return await models.Book.findByPk(googleBooksId)
    },

    googleBook: async (parent, {googleBooksId}, ctx) => {
      const result = await getGoogleBook(googleBooksId)
      const info = result.volumeInfo

      const thumbnailImage = info.imageLinks?.thumbnail.replace('http', 'https')
      const book = {
        title: info.title,
        description: info.description,
        publishDate: info.publishedDate,
        authors: info.authors,
        googleBooksId: result.id,
        publisher: info.publisher,
        averageRating: info.averageRating,
        thumbnail: info.imageLinks?.thumbnail ? thumbnailImage : null,
        pageCount: info.pageCount,
        categories: info.categories,
      }
      return book
    },

    searchBook: async (parent, {search, limit, offset}, {models}) => {
      if (limit && limit > 40) {
        throw new Error('Limit must be less than 40')
      }

      const searchTerm = encodeURI(search)

      const results = await getGoogleBooks(searchTerm, limit, offset)

      if (!results?.items?.length) {
        return null
      }

      const bookResults = await Promise.all(
        results.items.map(async result => {
          const info = result.volumeInfo
          const thumbnailImage = info.imageLinks?.thumbnail.replace(
            'http',
            'https',
          )

          const book = {
            title: info.title,
            description: info.description,
            publishDate: info.publishedDate,
            publisher: info.publisher,
            averageRating: info.averageRating,
            googleBooksId: result.id,
            thumbnail: info.imageLinks?.thumbnail ? thumbnailImage : null,
            pageCount: info.pageCount ? info.pageCount : 0,
          }
          return book
        }),
      )

      return bookResults
    },
  },

  Mutation: {
    createBook: async (parent, args, {models}) => {
      const book = await models.Book.create({
        ...args,
      })

      if (args.authors && args.authors.length) {
        try {
          await args.authors.forEach(async name => {
            const [author] = await models.Author.findOrCreate({
              where: {
                name,
              },
            })

            await book.addAuthor(author)
          })
        } catch (error) {
          logger.error(error)
        }
      }

      return await models.Book.findByPk(book.googleBooksId)
    },

    updateBook: async (parent, {googleBooksId, ...rest}, {models}) => {
      await models.Book.update(
        {
          ...rest,
        },
        {
          where: {
            googleBooksId,
          },
        },
      )

      return await models.Book.findByPk(googleBooksId)
    },
  },

  Book: {
    // authors: async (book, args, {models}) => {
    //   const b = await models.Book.findByPk(book.id)
    //   return await b.getAuthors()
    // },
    averageTimeToReadInSeconds: async (book, args, ctx) => {
      if (!book.pageCount) return null

      const estimatedWords = book.pageCount * AVERAGE_WORDS_PER_PAGE

      const totalReadingTimeSeconds =
        estimatedWords / (AVERAGE_READING_WORDS_PER_MINUTE / 60)

      return totalReadingTimeSeconds
    },

    reading: async (book, args, {me, models}) => {
      if (!me) {
        return null
      }

      if (!book.googleBooksId) return null

      return await models.Reading.findAll({
        where: {
          userId: me.id,
          bookGoogleBooksId: book.googleBooksId,
        },
        order: [['createdAt', 'DESC']],
      })
    },

    bookshelves: async (book, args, {me, models}) => {
      if (!me) return null
      if (!book.googleBooksId) return null

      return await models.BookShelf.findAll({
        include: [
          {
            model: models.Book,
            where: {googleBooksId: book.googleBooksId},
          },
        ],
        where: {
          userId: me.id,
        },
      })
    },

    goal: async (book, args, {me, models}) => {
      if (!me) return null
      if (!book.googleBooksId) return null

      return await models.Goal.findOne({
        where: {
          goalableId: book.googleBooksId,
          userId: me.id,
        },
      })
    },
  },
}
