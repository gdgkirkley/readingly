import * as hashFunction from 'object-hash'
import {
  isAuthenticated,
  canReadAllData,
  isReadingOwnUser,
  isReadingOwnBookshelf,
  isAccessingOwnReading,
  isAccessingOwnGoal,
  getPermissions,
} from '../permission'
import models from '../models'

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

test('isReadingOwnBookshelf returns true for own bookshelf', async () => {
  const user = {id: 1}

  const bookshelves = await models.BookShelf.findAll({
    where: {
      userId: 1,
    },
  })

  expect(
    await applyResolver(
      isReadingOwnBookshelf,
      {me: user, models},
      {bookshelfId: bookshelves[0].id},
    ),
  ).toBeTruthy()
})

test('isReadingOwnBookshelf returns false for another users bookshelf', async () => {
  const user = {id: 2}

  const bookshelves = await models.BookShelf.findAll({
    where: {
      userId: 1,
    },
  })

  expect(
    await applyResolver(
      isReadingOwnBookshelf,
      {me: user, models},
      {bookshelfId: bookshelves[0].id},
    ),
  ).toBeFalsy()
})

test('isAccessingOwnReading returns true for own reading', async () => {
  const user = {id: 1}

  const reading = await models.Reading.findAll({
    where: {
      userId: 1,
    },
  })

  expect(
    await applyResolver(
      isAccessingOwnReading,
      {me: user, models},
      {id: reading[0].id},
    ),
  ).toBeTruthy()
})

test('isAccessingOwnReading returns false for another users reading', async () => {
  const user = {id: 2}

  const reading = await models.Reading.findAll({
    where: {
      userId: 1,
    },
  })

  expect(
    await applyResolver(
      isAccessingOwnReading,
      {me: user, models},
      {id: reading[0].id},
    ),
  ).toBeFalsy()
})

test('isAccessingOwnGoal returns true for own goal', async () => {
  const user = {id: 1}

  expect(
    await applyResolver(isAccessingOwnGoal, {me: user, models}, {id: 1}),
  ).toBeTruthy()
})

test('isAccessingOwnGoal returns false for another users goal', async () => {
  const user = {id: 2}

  expect(
    await applyResolver(isAccessingOwnGoal, {me: user, models}, {id: 1}),
  ).toBeFalsy()
})
