import User from '../user'
import models from '../../models'

const res = jest.fn()

const parent = {}
const context = {me: {id: 1}, models}

test('updatePassword returns error for no user', async () => {
  await expect(
    User.Mutation.updatePassword(
      parent,
      {
        login: 'doesntexist@nothing.com',
        oldPassword: 'test123',
        newPassword: 'test123',
      },
      context,
    ),
  ).rejects.toThrow(/no user/i)
})

test('updatePassword returns error for wrong password', async () => {
  await expect(
    User.Mutation.updatePassword(
      parent,
      {
        login: 'gkirkley@readingly.com',
        oldPassword: 'test123',
        newPassword: 'test123',
      },
      context,
    ),
  ).rejects.toThrow(/wrong password/i)
})
