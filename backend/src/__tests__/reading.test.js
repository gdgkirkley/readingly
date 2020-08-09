/*
 * Integration tests for the reading schema
 */

import api, {loginUser, authRequest, expectedErrorRequest} from '../../test/api'
import {buildReading} from '../../test/generate'

const validBookId = 1
let loginCookie

beforeAll(async () => {
  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')
  loginCookie = cookie
})

test('can CRUD a reading', async () => {
  const reading = await buildReading()

  const createdReading = await createReading(reading, 'id progress')

  expect(createdReading.progress).toBe(reading.progress)

  const {
    data: {reading: readReading},
  } = await authRequest(
    `
        query($id: ID!) {
            reading(id: $id) {
                id
                progress
            }
        }
      `,
    {id: createdReading.id},
    loginCookie,
  )

  expect(readReading).toMatchObject(createdReading)

  const {
    data: {updateReading},
  } = await authRequest(
    `
            mutation($progress: Float!, $id: ID!) {
                updateReading(progress: $progress, id: $id) {
                    id
                    progress
                }
            }
        `,
    {progress: 0.3, id: createdReading.id},
    loginCookie,
  )

  expect(updateReading.progress).toBe(0.3)
  expect(updateReading.id).toBe(createdReading.id)

  const {
    data: {deleteReading},
  } = await authRequest(
    `
            mutation($id: ID!) {
                deleteReading(id: $id) {
                    message
                }
            }
        `,
    {progress: 0.3, id: createdReading.id},
    loginCookie,
  )

  expect(deleteReading.message).toMatchInlineSnapshot(
    `"Reading progress deleted"`,
  )
})

test('reading returns data and nested data on user and book', async () => {
  const reading = await buildReading()

  const createdReading = await createReading(
    reading,
    `
        id
        progress
        createdAt
        updatedAt
        book {
            id
            title
        }
        user {
            email
        }
  `,
  )

  expect(createdReading.book.id).toBe(validBookId.toString())
  expect(createdReading.user.email).toBe('gkirkley@readingly.com')
})

test('reading routes require user to be authenticated', async () => {
  let error

  const reading = await buildReading()

  const createdReading = await createReading(reading, 'id progress')

  error = await expectedErrorRequest(
    `
            query($id: ID!) {
                reading(id: $id) {
                    id
                    progress
                }
            }
          `,
    {id: createdReading.id},
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)

  error = await expectedErrorRequest(
    `
            query {
                readings {
                    id
                    progress
                }
            }
          `,
    {id: createdReading.id},
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)

  error = await expectedErrorRequest(
    `
            query($bookId: ID!) {
                bookReadings(bookId: $bookId) {
                    id
                    progress
                }
            }
          `,
    {bookId: validBookId},
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)

  error = await expectedErrorRequest(
    `
        mutation($progress: Float!, $bookId: ID!) {
            createReading(progress: $progress, bookId: $bookId) {
                id
                progress
            }
        }
          `,
    {progress: 0.3, bookId: validBookId},
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)

  error = await expectedErrorRequest(
    `
        mutation($progress: Float!, $id: ID!) {
            updateReading(progress: $progress, id: $id) {
                id
                progress
            }
        }
          `,
    {progress: 0.3, id: createdReading.id},
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)

  error = await expectedErrorRequest(
    `
        mutation($id: ID!) {
            deleteReading(id: $id) {
                message
            }
        }
          `,
    {id: createdReading.id},
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)
})

test("reading does not allow user to edit or delete another user's data", async () => {
  let error

  const reading = await buildReading()

  const createdReading = await createReading(reading, 'id progress')

  const {cookie} = await loginUser('pfraser@readingly.com', 'pfraser')

  error = await expectedErrorRequest(
    `
            mutation($progress: Float!, $id: ID!) {
                updateReading(progress: $progress, id: $id) {
                    id
                    progress
                }
            }
              `,
    {progress: 0.3, id: createdReading.id},
    {
      Cookie: cookie,
    },
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)

  error = await expectedErrorRequest(
    `
        mutation($id: ID!) {
            deleteReading(id: $id) {
                message
            }
        }
          `,
    {id: createdReading.id},
    {
      Cookie: cookie,
    },
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)
})

async function createReading(reading, returnValues) {
  const {
    data: {createReading},
  } = await authRequest(
    `
        mutation($progress: Float!, $bookId: ID!) {
            createReading(progress: $progress, bookId: $bookId) {
                ${returnValues}
            }
        }
    `,
    {progress: reading.progress, bookId: validBookId},
    loginCookie,
  )

  return createReading
}
