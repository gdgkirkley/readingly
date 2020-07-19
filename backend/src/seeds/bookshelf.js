import models from '../models'

async function createBookshelves() {
  await models.BookShelf.create({
    title: 'Favourites',
    userId: 1,
  })
}

export default createBookshelves
