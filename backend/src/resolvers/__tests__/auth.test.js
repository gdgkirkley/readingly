import api, {
  authRequest,
  loginUser,
  expectedErrorRequest,
} from '../../../test/api'

test('signUp creates new user', async () => {
  const newUser = {
    username: 'jsmith',
    email: 'jsmith@readingly.com',
    password: 'test123',
  }

  const {cookie} = await api.post(process.env.API_URL, {
    query: `
            mutation ($username: String!, $email: String!, $password: String!) {
                signUp(username: $username, email: $email, password: $password) {
                    id
                }
            }
        `,
    variables: newUser,
  })

  const {
    data: {me},
  } = await authRequest(
    `
        query {
            me {
                username
                email
            }
        }
      `,
    {},
    cookie,
  )

  expect(me).toStrictEqual({
    username: newUser.username,
    email: newUser.email,
  })
})

test('login logs user in and returns user', async () => {
  const {cookie} = await loginUser('pfraser@readingly.com', 'pfraser')

  const {
    data: {me},
  } = await authRequest(
    `
            query {
                me {
                    username
                    email
                }
            }
          `,
    {},
    cookie,
  )

  expect(me).toStrictEqual({
    username: 'pfraser',
    email: 'pfraser@readingly.com',
  })
})

test('login rejects on wrong password', async () => {
  const error = await expectedErrorRequest(
    `
        mutation ($login: String!, $password: String!){
            signIn(login: $login, password: $password) {
                email
            }
        }
    `,
    {login: 'gkirkley@readingly.com', password: 'test123'},
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(`"Invalid password"`)
})

test('login rejects on no user found', async () => {
  const error = await expectedErrorRequest(
    `
        mutation ($login: String!, $password: String!){
            signIn(login: $login, password: $password) {
                email
            }
        }
    `,
    {login: 'jsmith@readingly.com', password: 'test123'},
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(
    `"No user found for jsmith@readingly.com"`,
  )
})
