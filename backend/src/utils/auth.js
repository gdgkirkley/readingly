import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import logger from 'loglevel'
import expressJWT from 'express-jwt'
import {rule, shield} from 'graphql-shield'

const iterations = process.env.NODE_ENV === 'production' ? 1000 : 1

// seconds/minute * minutes/hour * hours/day * 60 days
const SIXTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 60

const secret = process.env.APP_SECRET

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

async function getUserToken({id, username, role}) {
  const issuedAt = Math.floor(Date.now() / 1000)

  return jwt.sign(
    {
      id,
      username,
      role,
      iat: issuedAt,
      exp: issuedAt + SIXTY_DAYS_IN_SECONDS,
    },
    secret,
  )
}

const authMiddleware = expressJWT({
  secret,
  algorithms: ['HS256'],
  credentialsRequired: false,
  getToken: function fromCookie(req) {
    if (req.cookies && req.cookies.token) {
      return req.cookies.token
    }
    return null
  },
})

export {getSaltAndHash, isPasswordValid, getUserToken, authMiddleware}
