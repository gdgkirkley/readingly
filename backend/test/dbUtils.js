const {sequelize} = require('../src/models')
const {
  createUsers,
  createBooks,
  createBookshelves,
  createGoals,
  createReadings,
} = require('../src/seeds')

async function resetDb() {
  await sequelize.sync({
    force: true,
  })

  await createBooks()
  await createUsers()
  await createBookshelves()
  await createGoals()
  await createReadings()
}

export {resetDb}
