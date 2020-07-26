import api, {
  authRequest,
  loginUser,
  expectedErrorRequest,
} from '../../../test/api'
import {buildBook} from '../../../test/generate'

test('create bookshelf creates a bookshelf', async () => {
  const login = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const bookshelfData = await authRequest(
    `
        mutation($title: String!) {
            createBookshelf(title: $title) {
                title
            }
        }
      `,
    {title: 'Favourites'},
    login.signIn.token,
  )

  expect(bookshelfData.createBookshelf.title).toBe('Favourites')
})

test('create bookshelf does not allow invalid title', async () => {
  const login = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const error = await expectedErrorRequest(
    `
        mutation($title: String!) {
            createBookshelf(title: $title) {
                title
            }
        }
      `,
    {title: ''},
    {
      Authorization: `Bearer ${login.signIn.token}`,
    },
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(
    `"Validation error: Validation notEmpty on title failed"`,
  )
})

test('addBook adds a book to a bookshelf', async () => {
  const login = await loginUser('gkirkley@readingly.com', 'gkirkley')
  const prideAndPrejudiceGoogleBookId = 's1gVAAAAYAAJ'

  const bookshelfData = await authRequest(
    `
            mutation($title: String!) {
                createBookshelf(title: $title) {
                    id
                    title
                }
            }
          `,
    {title: 'Favourites'},
    login.signIn.token,
  )

  const {addBook} = await authRequest(
    `
            mutation($googleBookId: String!, $bookshelfId: ID!) {
                addBook(googleBookId: $googleBookId, bookshelfId: $bookshelfId) {
                    title
                    books {
                        title
                    }
                    bookCount
                }
            }
          `,
    {
      googleBookId: prideAndPrejudiceGoogleBookId,
      bookshelfId: bookshelfData.createBookshelf.id,
    },
    login.signIn.token,
  )

  expect(addBook.bookCount).toBe(1)
  expect(addBook.books[0].title).toBe('Pride and Prejudice')
})

test('addBook does not create a book if it exists', async () => {
  const login = await loginUser('gkirkley@readingly.com', 'gkirkley')
  const book = await buildBook()

  const bookshelfData = await authRequest(
    `
              mutation($title: String!) {
                  createBookshelf(title: $title) {
                      id
                      title
                  }
              }
            `,
    {title: 'Favourites'},
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
    book,
    login.signIn.token,
  )

  const {addBook} = await authRequest(
    `
              mutation($googleBookId: String!, $bookshelfId: ID!) {
                  addBook(googleBookId: $googleBookId, bookshelfId: $bookshelfId) {
                      title
                      books {
                          id
                          title
                      }
                      bookCount
                  }
              }
            `,
    {
      googleBookId: book.googleBooksId,
      bookshelfId: bookshelfData.createBookshelf.id,
    },
    login.signIn.token,
  )

  expect(addBook.bookCount).toBe(1)
  expect(addBook.books[0].title).toBe(book.title)
  expect(addBook.books[0].id).toBe(bookData.createBook.id)
})

test("user cannot add book to another user's bookshelf", async () => {
  const login = await loginUser('gkirkley@readingly.com', 'gkirkley')
  const prideAndPrejudiceGoogleBookId = 's1gVAAAAYAAJ'

  const bookshelfData = await authRequest(
    `
            mutation($title: String!) {
                createBookshelf(title: $title) {
                    id
                    title
                }
            }
          `,
    {title: 'Favourites'},
    login.signIn.token,
  )

  const otherLogin = await loginUser('pfraser@readingly.com', 'pfraser')

  const error = await expectedErrorRequest(
    `
            mutation($googleBookId: String!, $bookshelfId: ID!) {
                addBook(googleBookId: $googleBookId, bookshelfId: $bookshelfId) {
                    title
                    books {
                        title
                    }
                    bookCount
                }
            }
          `,
    {
      googleBookId: prideAndPrejudiceGoogleBookId,
      bookshelfId: bookshelfData.createBookshelf.id,
    },
    {
      Authorization: `Bearer ${otherLogin.signIn.token}`,
    },
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)
})

test('addBook handles invalid Google Books id', async () => {
  const {signIn} = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const error = await expectedErrorRequest(
    `
                mutation($googleBookId: String!, $bookshelfId: ID!) {
                    addBook(googleBookId: $googleBookId, bookshelfId: $bookshelfId) {
                        title
                        books {
                            title
                        }
                        bookCount
                    }
                }
              `,
    {
      googleBookId: 'asdflmnasvs3',
      bookshelfId: 1,
    },
    {
      Authorization: `Bearer ${signIn.token}`,
    },
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(
    `"Unable to get book: The volume ID could not be found."`,
  )
})

test('mybookshelves returns user bookshelves', async () => {
  const login = await loginUser('pfraser@readingly.com', 'pfraser')

  await authRequest(
    `
          mutation($title: String!) {
              createBookshelf(title: $title) {
                  title
              }
          }
        `,
    {title: 'Favourites'},
    login.signIn.token,
  )

  const {mybookshelves} = await authRequest(
    `
            query {
                mybookshelves {
                    title
                }
            }
          `,
    {},
    login.signIn.token,
  )

  expect(mybookshelves).toHaveLength(1)
  expect(mybookshelves[0].title).toBe('Favourites')

  await authRequest(
    `
          mutation($title: String!) {
              createBookshelf(title: $title) {
                  title
              }
          }
        `,
    {title: 'Currently reading'},
    login.signIn.token,
  )

  const {mybookshelves: mybs} = await authRequest(
    `
            query {
                mybookshelves {
                    title
                }
            }
          `,
    {},
    login.signIn.token,
  )

  expect(mybs).toHaveLength(2)
  expect(mybs).toContainEqual({title: 'Favourites'})
  expect(mybs).toContainEqual({title: 'Currently reading'})
})

test('bookshelf returns a bookshelf', async () => {
  const login = await loginUser('pfraser@readingly.com', 'pfraser')

  const {createBookshelf: created} = await authRequest(
    `
          mutation($title: String!) {
              createBookshelf(title: $title) {
                  id
              }
          }
        `,
    {title: 'Favourites'},
    login.signIn.token,
  )

  const data = await authRequest(
    `
          query($bookshelfId: ID!) {
              bookshelf(bookshelfId: $bookshelfId) {
                  title
              }
          }
        `,
    {bookshelfId: created.id},
    login.signIn.token,
  )

  expect(data.bookshelf.title).toBe('Favourites')
})
