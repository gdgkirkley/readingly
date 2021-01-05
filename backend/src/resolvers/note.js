import {sequelize} from '../models'

export default {
  Query: {
    notes: async (parent, {googleBooksId}, {me, models}) => {
      const where = {
        userId: me.id,
      }

      if (googleBooksId) {
        where.bookGoogleBooksId = googleBooksId
      }

      return await models.Note.findAll({
        where,
      })
    },

    note: async (parent, {id}, {models}) => {
      return await getNoteById(id, models)
    },
  },

  Mutation: {
    createNote: async (parent, {note, page, googleBooksId}, {me, models}) => {
      await checkPage(models, googleBooksId, page)

      return await models.Note.create({
        note,
        page,
        bookGoogleBooksId: googleBooksId,
        userId: me.id,
      })
    },

    updateNote: async (parent, {id, note, page}, {me, models}) => {
      const noteToUpdate = await getNoteById(id, models)

      if (page) {
        checkPage(models, noteToUpdate.googleBooksId, page)
        noteToUpdate.page = page
      }

      noteToUpdate.note = note

      await noteToUpdate.save()

      return noteToUpdate
    },

    deleteNote: async (parent, {id}, {models}) => {
      const note = await getNoteById(id, models)

      await note.destroy()

      return {message: 'Note deleted'}
    },
  },

  Note: {
    book: async (note, args, ctx) => {
      return await note.getBook()
    },

    user: async (note, args, ctx) => {
      return await note.getUser()
    },

    privacyLevel: async (note, args, ctx) => {
      const [
        results,
        metadata,
      ] = await sequelize.query(
        `SELECT "privacyLevel" FROM privacy WHERE id = ${note.privacyId}`,
        {raw: false, type: sequelize.QueryTypes.SELECT},
      )

      return results?.privacyLevel
    },
  },
}

async function checkPage(models, googleBooksId, page) {
  const book = await models.Book.findByPk(googleBooksId)

  if (!book) {
    throw new Error(`There is no book for Id ${googleBooksId}`)
  }

  if (page < 0 || page > book.pageCount) {
    throw new Error('Invalid page number')
  }
}

async function getNoteById(id, models) {
  const note = await models.Note.findByPk(id)

  if (!note) {
    throw new Error(`No note with Id ${id}`)
  }

  return note
}
