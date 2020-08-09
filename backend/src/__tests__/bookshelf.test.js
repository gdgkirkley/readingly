/*
 * Integration tests for the bookshelf schema
 */

import api, {authRequest, loginUser, expectedErrorRequest} from '../../test/api'
import {buildBook} from '../../test/generate'

test('create bookshelf creates a bookshelf', async () => {
  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {data: bookshelfData} = await authRequest(
    `
        mutation($title: String!) {
            createBookshelf(title: $title) {
                title
            }
        }
      `,
    {title: 'Favourites'},
    cookie,
  )

  expect(bookshelfData.createBookshelf.title).toBe('Favourites')
})

test('create bookshelf does not allow invalid title', async () => {
  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')

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
      Cookie: cookie,
    },
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(
    `"Validation error: Validation notEmpty on title failed"`,
  )
})

test('addBook adds a book to a bookshelf', async () => {
  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')
  const prideAndPrejudiceGoogleBookId = 's1gVAAAAYAAJ'

  const {data: bookshelfData} = await authRequest(
    `
            mutation($title: String!) {
                createBookshelf(title: $title) {
                    id
                    title
                }
            }
          `,
    {title: 'Favourites'},
    cookie,
  )

  const {
    data: {addBook},
  } = await authRequest(
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
    cookie,
  )

  expect(addBook.bookCount).toBe(1)
  expect(addBook.books[0].title).toBe('Pride and Prejudice')
})

test('addBook does not create a book if it exists', async () => {
  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')
  const book = await buildBook()

  const {data: bookshelfData} = await authRequest(
    `
              mutation($title: String!) {
                  createBookshelf(title: $title) {
                      id
                      title
                  }
              }
            `,
    {title: 'Favourites'},
    cookie,
  )

  const {data: bookData} = await authRequest(
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
    cookie,
  )

  const {
    data: {addBook},
  } = await authRequest(
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
    cookie,
  )

  expect(addBook.bookCount).toBe(1)
  expect(addBook.books[0].title).toBe(book.title)
  expect(addBook.books[0].id).toBe(bookData.createBook.id)
})

test("user cannot add book to another user's bookshelf", async () => {
  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')
  const prideAndPrejudiceGoogleBookId = 's1gVAAAAYAAJ'

  const {data: bookshelfData} = await authRequest(
    `
            mutation($title: String!) {
                createBookshelf(title: $title) {
                    id
                    title
                }
            }
          `,
    {title: 'Favourites'},
    cookie,
  )

  const {cookie: otherCookie} = await loginUser(
    'pfraser@readingly.com',
    'pfraser',
  )

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
      Cookie: otherCookie,
    },
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)
})

test('addBook handles invalid Google Books id', async () => {
  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {
    data: {mybookshelf: bookshelf},
  } = await authRequest(
    `
            query($title: String!) {
                mybookshelf(title: $title) {
                  id
                }
            }
          `,
    {title: 'Favourites'},
    cookie,
  )

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
      bookshelfId: bookshelf.id,
    },
    {
      Cookie: cookie,
    },
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(
    `"Unable to get book: The volume ID could not be found."`,
  )
})

test('mybookshelves and mybookshelf returns user bookshelves', async () => {
  const {cookie} = await loginUser('pfraser@readingly.com', 'pfraser')

  await authRequest(
    `
          mutation($title: String!) {
              createBookshelf(title: $title) {
                  title
              }
          }
        `,
    {title: 'Favourites'},
    cookie,
  )

  const {
    data: {mybookshelves},
  } = await authRequest(
    `
            query {
                mybookshelves {
                    title
                }
            }
          `,
    {},
    cookie,
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
    cookie,
  )

  const {
    data: {mybookshelves: mybs},
  } = await authRequest(
    `
            query {
                mybookshelves {
                    title
                }
            }
          `,
    {},
    cookie,
  )

  expect(mybs).toHaveLength(2)
  expect(mybs).toContainEqual({title: 'Favourites'})
  expect(mybs).toContainEqual({title: 'Currently reading'})

  const {
    data: {mybookshelf: bookshelf},
  } = await authRequest(
    `
            query($title: String!) {
                mybookshelf(title: $title) {
                    title
                }
            }
          `,
    {title: 'Currently reading'},
    cookie,
  )

  expect(bookshelf.title).toBe('Currently reading')
})

test('bookshelf returns a bookshelf', async () => {
  const {cookie} = await loginUser('pfraser@readingly.com', 'pfraser')

  const {
    data: {createBookshelf: created},
  } = await authRequest(
    `
          mutation($title: String!) {
              createBookshelf(title: $title) {
                  id
              }
          }
        `,
    {title: 'Favourites'},
    cookie,
  )

  const {data} = await authRequest(
    `
          query($bookshelfId: ID!) {
              bookshelf(bookshelfId: $bookshelfId) {
                  title
              }
          }
        `,
    {bookshelfId: created.id},
    cookie,
  )

  expect(data.bookshelf.title).toBe('Favourites')
})

test('can create, update, delete a bookshelf', async () => {
  const {cookie} = await loginUser('pfraser@readingly.com', 'pfraser')

  const {
    data: {createBookshelf: created},
  } = await authRequest(
    `
          mutation($title: String!) {
              createBookshelf(title: $title) {
                  id
                  title
                  bookCount
              }
          }
        `,
    {title: 'Favourites'},
    cookie,
  )

  expect(created.title).toBe('Favourites')
  expect(created.bookCount).toBe(0)

  const {data} = await authRequest(
    `
          mutation($bookshelfId: ID!, $title: String!) {
            updateBookshelf(bookshelfId: $bookshelfId, title: $title) {
              title
            }
          }
        `,
    {bookshelfId: created.id, title: 'My Favourites'},
    cookie,
  )

  expect(data.updateBookshelf.title).toBe('My Favourites')

  const {data: deleteData} = await authRequest(
    `
          mutation($bookshelfId: ID!) {
            deleteBookshelf(bookshelfId: $bookshelfId) {
              message
            }
          }
        `,
    {bookshelfId: created.id},
    cookie,
  )

  expect(deleteData.deleteBookshelf.message).toMatchInlineSnapshot(
    `"Bookshelf deleted"`,
  )

  const {
    data: {mybookshelves},
  } = await authRequest(
    `
            query {
                mybookshelves {
                    title
                }
            }
          `,
    {},
    cookie,
  )

  expect(mybookshelves).toHaveLength(0)
})

test('removeBook removes the book from the list', async () => {
  const prideAndPrejudiceGoogleBookId = 's1gVAAAAYAAJ'

  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {
    data: {mybookshelf: bookshelf},
  } = await authRequest(
    `
            query($title: String!) {
                mybookshelf(title: $title) {
                  id
                    title
                }
            }
          `,
    {title: 'Favourites'},
    cookie,
  )

  const {
    data: {addBook},
  } = await authRequest(
    `
            mutation($googleBookId: String!, $bookshelfId: ID!) {
                addBook(googleBookId: $googleBookId, bookshelfId: $bookshelfId) {
                    title
                    books {
                        title
                        googleBooksId
                    }
                    bookCount
                }
            }
          `,
    {
      googleBookId: prideAndPrejudiceGoogleBookId,
      bookshelfId: bookshelf.id,
    },
    cookie,
  )

  expect(addBook.books).toHaveLength(1)
  expect(addBook.bookCount).toBe(1)
  expect(addBook.books[0].googleBooksId).toBe(prideAndPrejudiceGoogleBookId)

  const {
    data: {removeBook},
  } = await authRequest(
    `
    mutation($googleBooksId: String!, $bookshelfId: ID!) {
      removeBook(googleBooksId: $googleBooksId, bookshelfId: $bookshelfId) {
          title
          books {
              title
              googleBooksId
          }
          bookCount
      }
  }
    `,
    {
      googleBooksId: prideAndPrejudiceGoogleBookId,
      bookshelfId: bookshelf.id,
    },
    cookie,
  )

  expect(removeBook.books).toHaveLength(0)
  expect(removeBook.bookCount).toBe(0)
})
