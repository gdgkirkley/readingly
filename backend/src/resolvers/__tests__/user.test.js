import {loginUser, expectedErrorRequest, authRequest} from '../../../test/api'

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

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)

  const data = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {user} = await authRequest(
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
    data.signIn.token,
  )

  expect(user).toStrictEqual(expectedResult)
})

test('user resource does not allow USER role to fetch users except themselves', async () => {
  const expectedResult = {
    id: '2',
    username: 'pfraser',
    email: 'pfraser@readingly.com',
  }

  const data = await loginUser('pfraser@readingly.com', 'pfraser')

  const {user} = await authRequest(
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
    data.signIn.token,
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
      Authorization: `Bearer ${data.signIn.token}`,
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

  const data = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {user} = await authRequest(
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
    data.signIn.token,
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

  const login = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const {users} = await authRequest(
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
    login.signIn.token,
  )

  expect(users).toStrictEqual(expectedResult)
})

test('users rejects if not ADMIN', async () => {
  const login = await loginUser('pfraser@readingly.com', 'pfraser')

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
      Authorization: `Bearer ${login.signIn.token}`,
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

  const login = await loginUser('pfraser@readingly.com', 'pfraser')

  const {me} = await authRequest(
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
    login.signIn.token,
  )

  expect(me).toStrictEqual(expectedResult)
})

test('me rejects if not authenticated', async () => {
  const error = await expectedErrorRequest(
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
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Not Authorised!"`)
})
