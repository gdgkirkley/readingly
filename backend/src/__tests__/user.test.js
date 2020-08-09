/*
 * Integration tests for the user schema
 */

import api, {loginUser, expectedErrorRequest, authRequest} from '../../test/api'

test('user resource returns a user when authenticated', async () => {
  const expectedResult = {
    id: '1',
    username: 'gkirkley',
    email: 'gkirkley@readingly.com',
  }

  const error = await expectedErrorRequest(
    ` query ($id: ID!){
          user(id: $id) {
              id
              username
              email
          }
      }`,
    {id: 1},
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(
    `"Cannot read property 'role' of undefined"`,
  )

  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {
    data: {user},
  } = await authRequest(
    `
      query ($id: ID!){
          user(id: $id) {
              id
              username
              email
          }
      }
        `,
    {id: 1},
    cookie,
  )

  expect(user).toStrictEqual(expectedResult)
})

test('user resource does not allow USER role to fetch users except themselves', async () => {
  const expectedResult = {
    id: '2',
    username: 'pfraser',
    email: 'pfraser@readingly.com',
  }

  const {cookie} = await loginUser('pfraser@readingly.com', 'pfraser')

  const {
    data: {user},
  } = await authRequest(
    `
            query ($id: ID!){
                user(id: $id) {
                    id
                    username
                    email
                }
            }
        `,
    {id: 2},
    cookie,
  )
  expect(user).toStrictEqual(expectedResult)

  const error = await expectedErrorRequest(
    `
            query ($id: ID!){
                user(id: $id) {
                    id
                    username
                    email
                }
            }
        `,
    {id: 1},
    {
      Cookie: cookie,
    },
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)
})

test('user resource allows ADMIN role to fetch any user', async () => {
  const expectedResult = {
    id: '2',
    username: 'pfraser',
    email: 'pfraser@readingly.com',
  }

  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {
    data: {user},
  } = await authRequest(
    `
            query ($id: ID!){
                user(id: $id) {
                    id
                    username
                    email
                }
            }
        `,
    {id: 2},
    cookie,
  )

  expect(user).toStrictEqual(expectedResult)
})

test('users returns all users if ADMIN', async () => {
  const expectedResult = [
    {
      id: '1',
      username: 'gkirkley',
      email: 'gkirkley@readingly.com',
    },
    {
      id: '2',
      username: 'pfraser',
      email: 'pfraser@readingly.com',
    },
  ]

  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {
    data: {users},
  } = await authRequest(
    `
            query {
                users {
                    id
                    username
                    email
                }
            }
        `,
    {},
    cookie,
  )

  expect(users).toStrictEqual(expectedResult)
})

test('users rejects if not ADMIN', async () => {
  const {cookie} = await loginUser('pfraser@readingly.com', 'pfraser')

  const error = await expectedErrorRequest(
    `
    query {
      users {
        id
        username
        email
      }
    }
  `,
    {},
    {
      Cookie: cookie,
    },
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)
})

test('me gets user when authenticated', async () => {
  const expectedResult = {
    id: '2',
    username: 'pfraser',
    email: 'pfraser@readingly.com',
  }

  const {cookie} = await loginUser('pfraser@readingly.com', 'pfraser')

  const {
    data: {me},
  } = await authRequest(
    `
      query {
        me {
          id
          username
          email
        }
      }
    `,
    {},
    cookie,
  )

  expect(me).toStrictEqual(expectedResult)
})

test('me returns null if not authenticated', async () => {
  const {data} = await authRequest(
    `
      query {
        me {
          id
          username
          email
        }
      }
    `,
    {},
    null,
  )

  expect(data.me).toBe(null)
})

test('signout sends message and clearCookie response', async () => {
  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {data, response} = await api.post(
    process.env.API_URL,
    {
      query: `
    mutation {
      signout {
        message
      }
    }
    `,
      variables: {},
    },
    {
      Cookie: cookie,
    },
  )

  expect(response.headers['set-cookie']).toMatchInlineSnapshot(`
    Array [
      "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ]
  `)
  expect(data.data.signout.message).toBe('Goodbye!')
})

test('updateUser updates the user and returns', async () => {
  const {cookie} = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {data} = await authRequest(
    `
    mutation($id: ID!, $email: String, $username: String) {
      updateUser(id: $id, email: $email, username: $username) {
        email
        username
      }
    }
  `,
    {
      id: 1,
      username: 'mynewname',
      email: 'gkirkley@readingly.ca',
    },
    cookie,
  )

  expect(data.updateUser.email).toBe('gkirkley@readingly.ca')
  expect(data.updateUser.username).toBe('mynewname')
})

test('updateUser does not allow not logged in or user to change another user', async () => {
  const noUserError = await expectedErrorRequest(
    `
    mutation($id: ID!, $email: String, $username: String) {
      updateUser(id: $id, email: $email, username: $username) {
        email
        username
      }
    }
  `,
    {
      id: 1,
      username: 'mynewname',
      email: 'gkirkley@readingly.ca',
    },
  )

  expect(noUserError.errors[0].message).toMatchInlineSnapshot(
    `"Not Authorised!"`,
  )

  const {cookie} = await loginUser('pfraser@readingly.com', 'pfraser')

  const authError = await expectedErrorRequest(
    `
    mutation($id: ID!, $email: String, $username: String) {
      updateUser(id: $id, email: $email, username: $username) {
        email
        username
      }
    }
  `,
    {
      id: 1,
      username: 'mynewname',
      email: 'gkirkley@readingly.ca',
    },
    {
      Cookie: cookie,
    },
  )

  expect(authError.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)
})
