import * as hashFunction from 'object-hash'
import {
  isAuthenticated,
  canReadAllData,
  isReadingOwnUser,
  getPermissions,
} from '../permission'

async function applyResolver(resolver, resolverCtx, resolverArgs = {}) {
  const shieldContext = {
    _shield: {
      cache: {},
      hashFunction,
    },
  }

  const Options = jest.fn()

  const context = {
    ...resolverCtx,
    ...shieldContext,
  }

  const args = resolverArgs

  return resolver.resolve({}, args, context, {}, new Options())
}

test('isAuthenticated returns correct boolean', async () => {
  const me = {id: 1, username: 'test'}

  expect(await applyResolver(isAuthenticated, {})).toBeFalsy()
  expect(
    await applyResolver(isAuthenticated, {id: 'something totally wrong'}),
  ).toBeFalsy()
  expect(await applyResolver(isAuthenticated, {me})).toBeTruthy()
})

test('canReadAllData returns correct boolean', async () => {
  const user1 = {id: 1, username: 'test', role: 'ADMIN'}
  const user2 = {id: 2, username: 'test', role: 'USER'}

  expect(await applyResolver(canReadAllData, {me: user1})).toBeTruthy()
  expect(await applyResolver(canReadAllData, {me: user2})).toBeFalsy()
})

test('isReadingOwnUser returns correct boolean', async () => {
  const user = {id: 1, username: 'test', role: 'USER'}

  expect(
    await applyResolver(isReadingOwnUser, {me: user}, {id: 1}),
  ).toBeTruthy()
  expect(await applyResolver(isReadingOwnUser, {me: user}, {id: 2})).toBeFalsy()
})

test("getPermissions returns user's role", () => {
  const user = {id: 1, username: 'test', role: 'USER'}

  expect(getPermissions(user)).toBe('USER')
})
