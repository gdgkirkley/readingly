import * as hashFunction from 'object-hash'
import {isAuthenticated, canReadAnyUser} from '../permission'

async function applyResolver(resolver, resolverArgs) {
  const shieldContext = {
    _shield: {
      cache: {},
      hashFunction,
    },
  }

  const Options = jest.fn()

  const context = {
    ...resolverArgs,
    ...shieldContext,
  }

  const args = {}

  return resolver.resolve({}, args, context, {}, new Options())
}

test('isAuthenticated returns correct value', async () => {
  const me = {id: 1, username: 'test'}

  expect(await applyResolver(isAuthenticated, {})).toBeFalsy()
  expect(
    await applyResolver(isAuthenticated, {id: 'something totally wrong'}),
  ).toBeFalsy()
  expect(await applyResolver(isAuthenticated, {me})).toBeTruthy()
})

test('canReadAnyUser returns correct value', async () => {
  const user1 = {id: 1, username: 'test', role: 'ADMIN'}
  const user2 = {id: 2, username: 'test', role: 'USER'}

  expect(await applyResolver(canReadAnyUser, {me: user1})).toBeTruthy()
  expect(await applyResolver(canReadAnyUser, {me: user2})).toBeFalsy()
})
