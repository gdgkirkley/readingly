import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const iterations = process.env.NODE_ENV === 'production' ? 1000 : 1

// seconds/minute * minutes/hour * hours/day * 60 days
const SIXTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 60

function getSaltAndHash(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, 512, 'sha512')
    .toString('hex')
  return {salt, hash}
}

function isPasswordValid(password, salt, hash) {
  return (
    hash ===
    crypto.pbkdf2Sync(password, salt, iterations, 512, 'sha512').toString('hex')
  )
}

async function getUserToken({id, username}) {
  const issuedAt = Math.floor(Date.now() / 1000)

  return jwt.sign(
    {
      id,
      username,
      iat: issuedAt,
      exp: issuedAt + SIXTY_DAYS_IN_SECONDS,
    },
    process.env.APP_SECRET,
  )
}

export {getSaltAndHash, isPasswordValid, getUserToken}
