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
      return await models.Reading.findByPk(id)
    },

    bookReadings: async (parent, {bookId}, {me, models}) => {
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
      return await models.Reading.create({
        progress,
        bookId,
        userId: me.id,
      })
    },

    updateReading: async (parent, {id, progress}, {me, models}) => {
      await models.Reading.update(
        {
          progress,
        },
        {
          where: {
            id,
          },
        },
      )

      return await models.Reading.findByPk(id)
    },

    deleteReading: async (parent, {id}, {models}) => {
      await models.Reading.destroy({
        where: {
          id,
        },
      })

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
