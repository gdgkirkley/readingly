import {loginUser, authRequest} from '../../../test/api'
import {buildBook, getDescription} from '../../../test/generate'

let login

beforeEach(async () => {
  login = await loginUser('gkirkley@readingly.com', 'gkirkley')
})

test('search books returns book results', async () => {
  const data = await authRequest(
    `
                mutation($search: String!) {
                    searchBook(search: $search) {
                        title
                    }
                }
            `,
    {search: 'Lord of the Rings'},
    login.signIn.token,
  )

  expect(data.searchBook.length).toBe(10)
  expect(data.searchBook).toContainEqual({title: 'The Lord of the Rings'})
})

test('user can search and add book', async () => {
  const data = await authRequest(
    `
                mutation($search: String!) {
                    searchBook(search: $search) {
                        title
                        description
                        googleBooksId
                        authors {
                          name
                        }
                        thumbnail
                        pageCount
                        publishDate
                    }
                }
            `,
    {search: 'Lord of the Rings'},
    login.signIn.token,
  )

  const bookData = await authRequest(
    `
      mutation(
        $title: String!,
        $description: String,
        $googleBooksId: String!,
        $authors: [String!],
        $thumbnail: String!,
        $pageCount: Int!,
        $publishDate: String
      ) {
        createBook(
          title: $title,
          description: $description,
          googleBooksId: $googleBooksId,
          authors: $authors,
          thumbnail: $thumbnail,
          pageCount: $pageCount,
          publishDate: $publishDate
        ) {
          id
          title
        }
      }
  `,
    data.searchBook[0],
    login.signIn.token,
  )

  expect(bookData.createBook.title).toBe(data.searchBook[0].title)
})

test('user can add book and update book', async () => {
  const book = await buildBook()

  const bookData = await authRequest(
    `
      mutation(
        $title: String!,
        $description: String,
        $googleBooksId: String!,
        $authors: [String!],
        $thumbnail: String!,
        $pageCount: Int!,
        $publishDate: String
      ) {
        createBook(
          title: $title,
          description: $description,
          googleBooksId: $googleBooksId,
          authors: $authors,
          thumbnail: $thumbnail,
          pageCount: $pageCount,
          publishDate: $publishDate
        ) {
          id
          title
        }
      }
  `,
    book,
    login.signIn.token,
  )

  const newDescription = getDescription()

  const updateBookData = await authRequest(
    `
      mutation(
        $id: ID!
        $description: String,
      ) {
        updateBook(
          id: $id
          description: $description,
        ) {
          id
          title
          description
        }
      }
  `,
    {id: bookData.createBook.id, description: newDescription},
    login.signIn.token,
  )

  console.log(updateBookData)

  expect(updateBookData.updateBook.description).toBe(newDescription)
  expect(updateBookData.updateBook.title).toBe(book.title)
})
