import {getSaltAndHash, isPasswordValid} from '../auth'

test('getSaltAndHash returns valid password', () => {
  const password = 'test1234'

  const {salt, hash} = getSaltAndHash(password)

  expect(isPasswordValid(password, salt, hash)).toBe(true)
  expect(isPasswordValid('1234test', salt, hash)).toBe(false)
})
