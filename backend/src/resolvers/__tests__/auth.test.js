import api, {authRequest} from '../../../test/api'

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
