import models from '../models'

async function createReadings() {
  await models.Reading.create({
    progress: 30,
    bookGoogleBooksId: 's1gVAAAAYAAJ',
    userId: 1,
  })
}

export default createReadings
