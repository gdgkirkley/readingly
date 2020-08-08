import reading from '../reading'
import models from '../../models'

test('reading can CRUD readings', async () => {
  const newReading = {
    progress: 0.3,
    bookId: 1,
  }

  const createdReading = await reading.Mutation.createReading(
    {},
    {progress: newReading.progress, bookId: newReading.bookId},
    {me: {id: 1}, models},
  )

  expect(createdReading.progress).toBe(newReading.progress)
  expect(createdReading.bookId).toBe(newReading.bookId)
  expect(createdReading.userId).toBe(1)

  const queriedReadings = await reading.Query.readings(
    {},
    {},
    {me: {id: 1}, models},
  )

  expect(queriedReadings).toHaveLength(1)
  expect(queriedReadings[0].progress).toBe(newReading.progress)
  expect(queriedReadings[0].bookId).toBe(newReading.bookId)

  const queriedReading = await reading.Query.reading(
    {},
    {id: createdReading.id},
    {me: {id: 1}, models},
  )

  expect(queriedReading.progress).toBe(newReading.progress)
  expect(queriedReading.bookId).toBe(newReading.bookId)
  expect(queriedReading.userId).toBe(1)

  const queriedReadingByBookId = await reading.Query.bookReadings(
    {},
    {bookId: newReading.bookId},
    {me: {id: 1}, models},
  )

  expect(queriedReadingByBookId).toHaveLength(1)
  expect(queriedReadingByBookId[0].progress).toBe(newReading.progress)
  expect(queriedReadingByBookId[0].bookId).toBe(newReading.bookId)
  expect(queriedReadingByBookId[0].userId).toBe(1)

  const updatedReading = await reading.Mutation.updateReading(
    {},
    {id: createdReading.id, progress: 0.3},
    {me: {id: 1}, models},
  )

  expect(updatedReading.progress).toBe(0.3)
  expect(updatedReading.bookId).toBe(newReading.bookId)
  expect(updatedReading.userId).toBe(1)

  const deleteMessage = await reading.Mutation.deleteReading(
    {},
    {id: createdReading.id},
    {models},
  )

  expect(deleteMessage.message).toMatchInlineSnapshot(
    `"Reading progress deleted"`,
  )
})
