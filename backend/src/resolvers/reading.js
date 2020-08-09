export default {
  Query: {
    readings: async (parent, args, {me, models}) => {
      return await models.Reading.findAll({
        where: {
          userId: me.id,
        },
      })
    },

    reading: async (parent, {id}, {models}) => {
      return await getReadingByID(id, models)
    },

    bookReadings: async (parent, {bookId}, {me, models}) => {
      const book = await models.Book.findByPk(bookId)

      if (!book) {
        throw new Error(`No book with ID ${bookId}`)
      }

      return await models.Reading.findAll({
        where: {
          userId: me.id,
          bookId,
        },
      })
    },
  },

  Mutation: {
    createReading: async (parent, {progress, bookId}, {me, models}) => {
      checkProgress(progress)

      const book = await models.Book.findByPk(bookId)

      if (!book) {
        throw new Error(`There is no book for ID ${bookId}`)
      }

      return await models.Reading.create({
        progress,
        bookId,
        userId: me.id,
      })
    },

    updateReading: async (parent, {id, progress}, {models}) => {
      const reading = await getReadingByID(id, models)

      checkProgress(progress)

      reading.progress = progress

      await reading.save()

      return reading
    },

    deleteReading: async (parent, {id}, {models}) => {
      const reading = await getReadingByID(id, models)

      await reading.destroy()

      return {message: 'Reading progress deleted'}
    },
  },

  Reading: {
    book: async (reading, args, {models}) => {
      const r = await models.Reading.findByPk(reading.id)
      return await r.getBook()
    },

    user: async (reading, args, ctx) => {
      return await reading.getUser()
    },
  },
}

function checkProgress(progress) {
  if (progress < 0) {
    throw new Error('Progress cannot be negative')
  }
}

async function getReadingByID(id, models) {
  // TODO check UUID

  const reading = await models.Reading.findByPk(id)

  if (!reading) {
    throw new Error(`No reading progress with ID ${id}`)
  }

  return reading
}
