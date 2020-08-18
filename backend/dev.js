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

  const seed = process.env.NODE_ENV !== 'test'

  if (seed) {
    await sequelize.sync({
      force: true,
    })

    console.log('Seeding database')
    await createUsers()
    await createBooks()
    await createBookshelves()
    await createGoals()
    await createReadings()
  }
  require('./src')
})()
