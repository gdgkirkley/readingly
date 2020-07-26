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
