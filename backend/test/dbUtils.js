const {sequelize} = require('../src/models')
const {createUsers, createBooks, createBookshelves} = require('../src/seeds')

async function resetDb() {
  await sequelize.sync({
    force: true,
  })

  await createBooks()
  await createUsers()
  await createBookshelves()
}

export {resetDb}
