export default {
  Query: {
    goals: async (parent, args, {models, me}) => {
      return await models.Goal.findAll({
        where: {
          userId: me.id,
        },
      })
    },
    goal: async (parent, {id}, {models}) => {
      return await getGoalById(id, models)
    },
  },

  Mutation: {
    createGoal: async (parent, {goalDate, goalableId}, {me, models}) => {
      let book, bookshelf

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
        goal = await book.createGoal({goalDate, userId: me.id})
      } else {
        goal = await bookshelf.createGoal({goalDate, userId: me.id})
      }

      return goal
    },
    updateGoal: async (parent, {id, goalDate}, {me, models}) => {
      const goal = await getGoalById(id, models)

      goal.goalDate = goalDate

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
