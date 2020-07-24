import logger from 'loglevel'
import {startServer} from './start.js'

const isTest = process.env.NODE_ENV === 'test'
logger.setLevel(isTest ? 'warn' : 'info')

startServer()
