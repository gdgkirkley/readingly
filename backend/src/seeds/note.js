import models from '../models'

async function createNotes() {
  await models.Note.create({
    note:
      'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    page: 1,
    bookGoogleBooksId: 's1gVAAAAYAAJ',
    userId: 1,
  })
}

export default createNotes
