import api from '../../../test/api'

test('user resource returns a user when authenticated', async () => {
  const expectedResult = {
    id: '1',
    username: 'gkirkley',
    email: 'gkirkley@readingly.com',
  }

  const {data} = await api.post(process.env.API_URL, {
    query: `
            mutation ($login: String!, $password: String!){
                signIn(login: $login, password: $password) {
                    token
                }
            }
        `,
    variables: {login: 'gkirkley@readingly.com', password: 'gkirkley'},
  })

  const {data: uData} = await api.post(
    process.env.API_URL,
    {
      query: `
            query ($id: ID!){
                user(id: $id) {
                    id
                    username
                    email
                }
            }
        `,
      variables: {id: 1},
    },
    {
      headers: {
        Authorization: `Bearer ${data.signIn.token}`,
      },
    },
  )

  expect(uData.user).toStrictEqual(expectedResult)
})
