;(async () => {
  require('@babel/register')

  const {sequelize} = require('./src/models')
  const {
    createUsers,
    createBooks,
    createBookshelves,
    createGoals,
    createReadings,
  } = require('./src/seeds')

  const seed = process.env.SEED_DATABASE || process.env.NODE_ENV === 'test'

  await sequelize.sync({
    force: seed,
  })

  if (seed) {
    console.log('Seeding database')
    await createUsers()
    await createBooks()
    await createBookshelves()
    await createGoals()
    await createReadings()
  }
  require('./src')
})()
