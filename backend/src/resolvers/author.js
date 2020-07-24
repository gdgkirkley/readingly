export default {
  Query: {
    authors: async (parent, args, {models}) => {
      return await models.Author.findAll()
    },
    author: async (parent, {id}, {models}) => {
      return await models.Author.findByPk(id)
    },
  },

  Mutation: {
    createAuthor: async (parent, {name}, {models}) => {
      const author = await models.Author.create({name})

      return author
    },
  },

  Author: {
    books: async (author, args, {models}) => {
      const a = await models.Author.findByPk(author.id)
      return await a.getBooks()
    },
  },
}
