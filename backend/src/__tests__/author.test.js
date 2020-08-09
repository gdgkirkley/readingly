/*
 * Integration tests for the author schema
 */

import api, {authRequest, loginUser, expectedErrorRequest} from '../../test/api'
import {buildAuthor} from '../../test/generate'

test('createAuthor can create an author', async () => {
  const author = await buildAuthor()

  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {data: authorData} = await authRequest(
    `
        mutation($name: String!) {
            createAuthor(name: $name) {
                name
            }
        }
    `,
    author,
    cookie,
  )

  expect(authorData.createAuthor.name).toBe(author.name)
})

test('authors returns an array of authors', async () => {
  const {authorData, author} = await createAuthor()

  const {data: authors} = await api.post(process.env.API_URL, {
    query: `
        query {
            authors {
                name
            }
        }
      `,
  })

  expect(authors.data.authors).toContainEqual(author)
  expect(authors.data.authors).toContainEqual(authorData.createAuthor)
})

test('authors returns an array of authors', async () => {
  const {authorData, author} = await createAuthor()

  const {data: auth} = await api.post(process.env.API_URL, {
    query: `
          query($id: ID!) {
              author(id: $id) {
                  name
              }
          }
        `,
    variables: {id: '1'},
  })

  expect(auth.data.author).toStrictEqual(author)
  expect(auth.data.author).toStrictEqual(authorData.createAuthor)
})

async function createAuthor() {
  const author = await buildAuthor()
  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {data: authorData} = await authRequest(
    `
          mutation($name: String!) {
              createAuthor(name: $name) {
                  name
              }
          }
      `,
    author,
    cookie,
  )

  return {authorData, author}
}
