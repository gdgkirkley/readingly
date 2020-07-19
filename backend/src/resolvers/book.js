import {Op} from 'sequelize'
import logger from 'loglevel'
import axios, {AxiosError} from 'axios'

const googleBooksEndpoint = 'https://www.googleapis.com/books/v1/volumes'

export default {
  Query: {
    books: async (parent, args, {models}) => {
      return await models.Book.findAll()
    },
    book: async (parent, {id}, {models}) => {
      return await models.Book.findByPk(id)
    },
  },

  Mutation: {
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
            const [book] = await models.Book.findOrCreate({
              where: {
                title: info.title,
                description: info.description,
                publishDate: info.publishedDate,
                googleBooksId: result.id,
                thumbnail: info.imageLinks.thumbnail,
                pageCount: info.pageCount,
              },
            })
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
}

async function getGoogleBooks(search) {
  try {
    const response = await axios.get(`${googleBooksEndpoint}?q=${search}`)

    return response.data
  } catch (error) {
    const data = error.response
    logger.error(data)
    throw new AxiosError('Unable to get books')
  }
}
