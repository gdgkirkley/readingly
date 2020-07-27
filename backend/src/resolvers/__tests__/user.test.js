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
