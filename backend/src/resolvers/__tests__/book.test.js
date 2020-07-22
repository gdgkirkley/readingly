import {loginUser, authRequest} from '../../../test/api'

test('search books returns book results', async () => {
  const login = await loginUser('gkirkley@readingly.com', 'gkirkley')

  const data = await authRequest(
    `
                mutation($search: String!) {
                    searchBook(search: $search) {
                        title
                    }
                }
            `,
    {search: 'Lord of the Rings'},
    login.signIn.token,
  )

  expect(data.searchBook.length).toBe(10)
  expect(data.searchBook).toContainEqual({title: 'The Lord of the Rings'})
})
