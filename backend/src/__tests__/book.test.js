/*
 * Integration tests for the book schema
 */

import api, {loginUser, authRequest} from '../../test/api'
import {buildBook, getDescription} from '../../test/generate'

let login

beforeEach(async () => {
  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')
  login = cookie
})

test('books returns an array of books', async () => {
  const expectedResult = {
    title: 'Pride and Prejudice',
    description:
      'Austen’s most celebrated novel tells the story of Elizabeth Bennet, a bright, lively young woman with four sisters, and a mother determined to marry them to wealthy men. At a party near the Bennets’ home in the English countryside, Elizabeth meets the wealthy, proud Fitzwilliam Darcy. Elizabeth initially finds Darcy haughty and intolerable, but circumstances continue to unite the pair. Mr. Darcy finds himself captivated by Elizabeth’s wit and candor, while her reservations about his character slowly vanish. The story is as much a social critique as it is a love story, and the prose crackles with Austen’s wry wit.',
  }

  const {data: bookData} = await api.post(`${process.env.API_URL}`, {
    query: `
      query {
        books {
          title
          description
        }
      }
    `,
  })

  expect(bookData.data.books).toHaveLength(1)
  expect(bookData.data.books[0]).toStrictEqual(expectedResult)
})

test('book returns a book', async () => {
  const expectedResult = {
    title: 'Pride and Prejudice',
    description:
      'Austen’s most celebrated novel tells the story of Elizabeth Bennet, a bright, lively young woman with four sisters, and a mother determined to marry them to wealthy men. At a party near the Bennets’ home in the English countryside, Elizabeth meets the wealthy, proud Fitzwilliam Darcy. Elizabeth initially finds Darcy haughty and intolerable, but circumstances continue to unite the pair. Mr. Darcy finds himself captivated by Elizabeth’s wit and candor, while her reservations about his character slowly vanish. The story is as much a social critique as it is a love story, and the prose crackles with Austen’s wry wit.',
  }

  const {data: bookData} = await api.post(`${process.env.API_URL}`, {
    query: `
      query($googleBooksId: ID!) {
        book(googleBooksId: $googleBooksId) {
          title
          description
        }
      }
    `,
    variables: {googleBooksId: 's1gVAAAAYAAJ'},
  })

  expect(bookData.data.book).toStrictEqual(expectedResult)
})

test('googleBook returns a book', async () => {
  const pillarsOfTheEarth = 'VB7IAgAAQBAJ'

  const {
    data: {data},
  } = await api.post(`${process.env.API_URL}`, {
    query: `
      query($googleBooksId: String!) {
        googleBook(googleBooksId: $googleBooksId) {
          title
        }
      }
    `,
    variables: {googleBooksId: pillarsOfTheEarth},
  })

  expect(data.googleBook.title).toBe('The Pillars of the Earth')
})

test('search books returns book results', async () => {
  const {data} = await authRequest(
    `
      query($search: String!) {
          searchBook(search: $search) {
              title
          }
      }
  `,
    {search: 'Lord of the Rings'},
    login,
  )

  expect(data.searchBook).toHaveLength(16)
  expect(data.searchBook).toContainEqual({title: 'The Lord of the Rings'})
})

test('user can search and add book', async () => {
  const {data} = await authRequest(
    `
        query($search: String!) {
            searchBook(search: $search) {
                title
                description
                googleBooksId
                authors
                thumbnail
                pageCount
                publishDate
            }
        }
    `,
    {search: 'Lord of the Rings'},
    login,
  )

  const {data: bookData} = await authRequest(
    `
      mutation(
        $title: String!,
        $description: String,
        $googleBooksId: ID!,
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
          title
        }
      }
  `,
    data.searchBook[0],
    login,
  )

  expect(bookData.createBook.title).toBe(data.searchBook[0].title)
})

test('user can add book and update book', async () => {
  const book = await buildBook()

  const {data: bookData} = await authRequest(
    `
      mutation(
        $title: String!,
        $description: String,
        $googleBooksId: ID!,
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
          googleBooksId
          title
        }
      }
  `,
    book,
    login,
  )

  const newDescription = getDescription()

  const {data: updateBookData} = await authRequest(
    `
      mutation(
        $googleBooksId: ID!
        $description: String,
      ) {
        updateBook(
          googleBooksId: $googleBooksId
          description: $description,
        ) {
          title
          description
        }
      }
  `,
    {
      googleBooksId: bookData.createBook.googleBooksId,
      description: newDescription,
    },
    login,
  )

  expect(updateBookData.updateBook.description).toBe(newDescription)
  expect(updateBookData.updateBook.title).toBe(book.title)
})
