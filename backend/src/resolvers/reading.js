import {sequelize} from '../models'
import {
  AVERAGE_READING_WORDS_PER_MINUTE,
  AVERAGE_WORDS_PER_PAGE,
} from '../utils/constants'

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

    bookReadings: async (parent, {googleBooksId}, {me, models}) => {
      const book = await models.Book.findByPk(googleBooksId)

      if (!book) {
        throw new Error(`No book with ID ${googleBooksId}`)
      }

      return await models.Reading.findAll({
        where: {
          userId: me.id,
          bookGoogleBooksId: googleBooksId,
        },
      })
    },
  },

  Mutation: {
    createReading: async (
      parent,
      {progress, googleBooksId, privacyId},
      {me, models},
    ) => {
      checkProgress(progress)

      const book = await models.Book.findByPk(googleBooksId)

      if (!book) {
        throw new Error(`There is no book for ID ${googleBooksId}`)
      }

      return await models.Reading.create({
        progress,
        privacyId,
        bookGoogleBooksId: googleBooksId,
        userId: me.id,
      })
    },

    updateReading: async (parent, {id, progress, privacyId}, {models}) => {
      const reading = await getReadingByID(id, models)

      checkProgress(progress)

      reading.progress = progress

      if (privacyId) {
        reading.privacyId = privacyId
      }

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
      return await reading.getBook()
    },

    user: async (reading, args, ctx) => {
      return await reading.getUser()
    },

    timeRemainingInSeconds: async (reading, args, {models}) => {
      if (!reading.progress) return null

      const book = await reading.getBook()

      const estimatedRemainingWords =
        (book.pageCount - reading.progress) * AVERAGE_WORDS_PER_PAGE

      const totalRemainingTimeSeconds =
        estimatedRemainingWords / (AVERAGE_READING_WORDS_PER_MINUTE / 60)

      return totalRemainingTimeSeconds
    },

    privacyLevel: async (reading, args, ctx) => {
      const [
        results,
        metadata,
      ] = await sequelize.query(
        `SELECT "privacyLevel" FROM privacy WHERE id = ${reading.privacyId}`,
        {raw: false, type: sequelize.QueryTypes.SELECT},
      )

      return results?.privacyLevel
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
