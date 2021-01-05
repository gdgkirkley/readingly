import {
  AVERAGE_READING_WORDS_PER_MINUTE,
  AVERAGE_WORDS_PER_PAGE,
} from '../utils/constants'
import {sequelize} from '../models'

const ONE_DAY = 1000 * 60 * 60 * 24

export default {
  Query: {
    goals: async (parent, {status}, {models, me}) => {
      const where = status
        ? {
            status,
            userId: me.id,
          }
        : {
            userId: me.id,
          }

      return await models.Goal.findAll({
        where,
      })
    },
    goal: async (parent, {id}, {models}) => {
      return await getGoalById(id, models)
    },
  },

  Mutation: {
    createGoal: async (
      parent,
      {goalDate, goalableId, startDate, status},
      {me, models},
    ) => {
      let book, bookshelf

      // If it's a UUID, then it must be a bookshelf. Google Books Ids are not UUIDs.
      if (isUUID(goalableId)) {
        bookshelf = await models.BookShelf.findByPk(goalableId)
      } else {
        book = await models.Book.findByPk(goalableId)
      }

      if (!book && !bookshelf) {
        throw new Error(`Goalable ID ${goalableId} is invalid ID`)
      }

      const goalTest = await models.Goal.findOne({
        where: {
          goalableId: goalableId,
        },
      })

      if (goalTest) {
        throw new Error(`You already have a goal for ${goalableId}`)
      }

      let goal

      if (book) {
        goal = await book.createGoal({
          goalDate,
          startDate,
          status,
          userId: me.id,
        })
      } else {
        goal = await bookshelf.createGoal({
          goalDate,
          startDate,
          status,
          userId: me.id,
        })
      }

      return goal
    },
    updateGoal: async (
      parent,
      {id, goalDate, startDate, endDate, status},
      {me, models},
    ) => {
      const goal = await getGoalById(id, models)

      goal.goalDate = goalDate
      goal.startDate = startDate
      goal.endDate = endDate
      if (status) {
        goal.status = status
      }

      await goal.save()

      return goal
    },
    deleteGoal: async (parent, {id}, {models}) => {
      const goal = await getGoalById(id, models)

      await goal.destroy()

      return {message: 'Goal deleted'}
    },
  },

  Goal: {
    goalable: async (goal, args, ctx) => {
      return await goal.getGoalable()
    },

    readingRecommendation: async (goal, args, {me, models}) => {
      return getReadingRecommdation(goal, models, me)
    },

    readingRecommendationSeconds: async (goal, args, {me, models}) => {
      const readingRecommendation = await getReadingRecommdation(
        goal,
        models,
        me,
      )
      if (!readingRecommendation) return null

      const estimatedWords = readingRecommendation * AVERAGE_WORDS_PER_PAGE

      const totalReadingTimeSeconds =
        estimatedWords / (AVERAGE_READING_WORDS_PER_MINUTE / 60)

      return totalReadingTimeSeconds
    },

    privacyLevel: async (goal, args, ctx) => {
      const [
        results,
        metadata,
      ] = await sequelize.query(
        `SELECT "privacyLevel" FROM privacy WHERE id = ${goal.privacyId}`,
        {raw: false, type: sequelize.QueryTypes.SELECT},
      )

      return results?.privacyLevel
    },
  },

  Goalable: {
    __resolveType(obj, context, info) {
      if (obj.googleBooksId) {
        return 'Book'
      }

      if (obj.id) {
        return 'BookShelf'
      }

      return null
    },
  },
}

async function getReadingRecommdation(goal, models, me) {
  const goalable = await goal.getGoalable()
  const daysUntilGoal = getDaysUntilDate(goal.goalDate)

  if (goal.goalableType === 'BOOK') {
    const progress = await models.Reading.findAll({
      limit: 1,
      where: {
        userId: me.id,
        bookGoogleBooksId: goalable.googleBooksId,
      },
      order: [['createdAt', 'DESC']],
    })

    const pagesToRead = progress.length
      ? goalable.pageCount - progress[0].progress
      : goalable.pageCount

    return daysUntilGoal > 0
      ? Math.round(pagesToRead / Math.ceil(daysUntilGoal))
      : pagesToRead
  } else {
    const totalPages = await goalable.getTotalPagesOnShelf()
    return Math.round(totalPages / daysUntilGoal)
  }
}

async function getGoalById(id, models) {
  const goal = await models.Goal.findByPk(id)

  if (!goal) {
    throw new Error(`There is no goal for ID ${id}`)
  }

  return goal
}

function isUUID(id) {
  const reg = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  return reg.test(id)
}

export function getDaysUntilDate(date) {
  const today = new Date()
  return Math.ceil(date.getTime() - today.getTime()) / ONE_DAY
}
