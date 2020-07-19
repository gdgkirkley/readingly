import logger from 'loglevel'
import axios, {AxiosError} from 'axios'
const googleBooksEndpoint = 'https://www.googleapis.com/books/v1/volumes'

async function getGoogleBooks(search) {
  try {
    const response = await axios.get(`${googleBooksEndpoint}?q=${search}`)

    return response.data
  } catch (error) {
    const data = error.response
    logger.error(data)
    throw new AxiosError('Unable to get books')
  }
}

async function getGoogleBook(googleBookId) {
  try {
    const response = await axios.get(`${googleBooksEndpoint}/${googleBookId}`)

    return response.data
  } catch (error) {
    const data = error.response
    logger.error(data)
    throw new AxiosError('Unable to get books')
  }
}

export {getGoogleBooks, getGoogleBook}
