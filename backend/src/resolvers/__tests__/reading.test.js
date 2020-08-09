import reading from '../reading'
import models from '../../models'
import {getUUID} from '../../../test/generate'

const validUser = {id: 1}
const parent = {}
const context = {me: validUser, models}

let testReading

beforeEach(async () => {
  testReading = await models.Reading.create({
    progress: 0.5,
    bookGoogleBooksId: 's1gVAAAAYAAJ',
    userId: validUser.id,
  })
})

test('reading can create readings', async () => {
  const newReading = {
    progress: 0.3,
    googleBooksId: 's1gVAAAAYAAJ',
  }

  const createdReading = await reading.Mutation.createReading(
    parent,
    {
      progress: newReading.progress,
      googleBooksId: newReading.googleBooksId,
    },
    context,
  )

  expect(createdReading.progress).toBe(newReading.progress)
  expect(createdReading.bookGoogleBooksId).toBe(newReading.googleBooksId)
  expect(createdReading.userId).toBe(validUser.id)
})

test('createReading returns error for invalid bookId', async () => {
  await expect(
    reading.Mutation.createReading(
      parent,
      {progress: 0.3, googleBooksId: 's1gVAAAAYAab'},
      context,
    ),
  ).rejects.toThrow(/no book/i)
})

test('createReading rejects negative progress', async () => {
  await expect(
    reading.Mutation.createReading(
      parent,
      {progress: -0.5, googleBooksId: 's1gVAAAAYAAJ'},
      context,
    ),
  ).rejects.toThrow(/cannot be negative/i)
})

test('reading can return book details', async () => {
  const readingBook = await reading.Reading.book(testReading, {}, context)

  expect(readingBook.googleBooksId).toBe(testReading.bookGoogleBooksId)
  // This will only change if seed data changes
  expect(readingBook.title).toMatchInlineSnapshot(`"Pride and Prejudice"`)
})

test('reading can return user details', async () => {
  const readingUser = await reading.Reading.user(testReading, {}, context)

  expect(readingUser.id).toBe(validUser.id)
})

test('reading can update reading', async () => {
  const updatedReading = await reading.Mutation.updateReading(
    parent,
    {id: testReading.id, progress: 0.3},
    context,
  )

  expect(updatedReading.progress).toBe(0.3)
  expect(updatedReading.bookGoogleBooksId).toBe(testReading.bookGoogleBooksId)
  expect(updatedReading.userId).toBe(1)
})

test('updateReading rejects negative progress', async () => {
  await expect(
    reading.Mutation.updateReading(
      parent,
      {progress: -0.5, id: testReading.id},
      context,
    ),
  ).rejects.toThrow(/cannot be negative/i)
})

test('reading can delete reading', async () => {
  const deleteMessage = await reading.Mutation.deleteReading(
    parent,
    {id: testReading.id},
    context,
  )

  expect(deleteMessage.message).toMatchInlineSnapshot(
    `"Reading progress deleted"`,
  )
})

test('deleteReading throws error for invalid id', async () => {
  const fakeUUID = getUUID()

  await expect(
    reading.Mutation.deleteReading(parent, {id: fakeUUID}, context),
  ).rejects.toThrow(/no reading progress/i)
})

test('readings query returns readings', async () => {
  const readings = await reading.Query.readings(parent, {}, context)

  expect(readings).toEqual(
    expect.arrayContaining([expect.objectContaining({id: testReading.id})]),
  )
})

test('reading query returns a reading', async () => {
  const r = await reading.Query.reading(parent, {id: testReading.id}, context)

  expect(r.progress).toBe(testReading.progress)
})

test('reading query throws error for invalid reading id', async () => {
  const fakeUUID = getUUID()

  await expect(
    reading.Query.reading(parent, {id: fakeUUID}, context),
  ).rejects.toThrow(/no reading progress/i)
})

test('bookReading query returns reading', async () => {
  const readings = await reading.Query.bookReadings(
    parent,
    {googleBooksId: testReading.bookGoogleBooksId},
    context,
  )

  expect(readings).toEqual(
    expect.arrayContaining([expect.objectContaining({id: testReading.id})]),
  )
})

test('bookReading query throws error for invalid book', async () => {
  await expect(
    reading.Query.bookReadings(
      parent,
      {googleBooksId: 's1gVAAAAYAab'},
      context,
    ),
  ).rejects.toThrow(/no book/i)
})
