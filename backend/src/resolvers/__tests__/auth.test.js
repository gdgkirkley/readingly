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

  const result = await api.post(process.env.API_URL, {
    query: `
            mutation ($username: String!, $email: String!, $password: String!) {
                signUp(username: $username, email: $email, password: $password) {
                    token
                }
            }
        `,
    variables: newUser,
  })

  const {me} = await authRequest(
    `
        query {
            me {
                username
                email
            }
        }
      `,
    {},
    result.data.signUp.token,
  )

  expect(me).toStrictEqual({username: newUser.username, email: newUser.email})
})

test('login logs user in and returns token', async () => {
  const login = await loginUser('pfraser@readingly.com', 'pfraser')

  const {me} = await authRequest(
    `
            query {
                me {
                    username
                    email
                }
            }
          `,
    {},
    login.signIn.token,
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
                token
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
                token
            }
        }
    `,
    {login: 'jsmith@readingly.com', password: 'test123'},
  )

  expect(error.errors[0].message).toMatchInlineSnapshot(
    `"No user found for jsmith@readingly.com"`,
  )
})
