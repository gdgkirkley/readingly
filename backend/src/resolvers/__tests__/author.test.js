import api, {
  authRequest,
  loginUser,
  expectedErrorRequest,
} from '../../../test/api'
import {buildAuthor} from '../../../test/generate'

test('createAuthor can create an author', async () => {
  const author = await buildAuthor()

  const login = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const authorData = await authRequest(
    `
        mutation($name: String!) {
            createAuthor(name: $name) {
                name
            }
        }
    `,
    author,
    login.signIn.token,
  )

  expect(authorData.createAuthor.name).toBe(author.name)
})

test('authors returns an array of authors', async () => {
  const {authorData, author} = await createAuthor()

  const authors = await api.post(process.env.API_URL, {
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

  const auth = await api.post(process.env.API_URL, {
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
  const login = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const authorData = await authRequest(
    `
          mutation($name: String!) {
              createAuthor(name: $name) {
                  name
              }
          }
      `,
    author,
    login.signIn.token,
  )

  return {authorData, author}
}
