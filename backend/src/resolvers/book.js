import {Op} from 'sequelize'
import logger from 'loglevel'
import {getGoogleBooks} from '../utils/googleBooks'

export default {
  Query: {
    books: async (parent, args, {models}) => {
      return await models.Book.findAll()
    },
    book: async (parent, {id}, {models}) => {
      return await models.Book.findByPk(id)
    },
    searchBook: async (parent, {search}, {models}) => {
      const books = new Set()
      const booksToAdd = await models.Book.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              description: {
                [Op.iLike]: `%${search}%`,
              },
            },
          ],
        },
        order: [['title']],
      })

      booksToAdd.forEach(book => {
        books.add(book)
      })

      if (books.size < 10) {
        const searchTerm = encodeURI(search)

        const results = await getGoogleBooks(searchTerm)

        if (!results?.items?.length) {
          return null
        }

        const bookResults = await Promise.all(
          results.items.map(async result => {
            const info = result.volumeInfo
            const book = {
              title: info.title,
              description: info.description,
              publishDate: info.publishedDate,
              googleBooksId: result.id,
              thumbnail: info.imageLinks.thumbnail,
              pageCount: info.pageCount,
            }
            return book
          }),
        )

        bookResults.forEach(result => {
          books.add(result)
        })
      }

      return Array.from(books)
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

      return await models.Book.findByPk(book.id)
    },
    updateBook: async (parent, {id, ...rest}, {models}) => {
      await models.Book.update(
        {
          ...rest,
        },
        {
          where: {
            id: id,
          },
        },
      )

      return await models.Book.findByPk(id)
    },
  },

  Book: {
    authors: async (book, args, {models}) => {
      const b = await models.Book.findByPk(book.id)
      return await b.getAuthors()
    },
  },
}
