import logger from 'loglevel'
import axios, {AxiosError} from 'axios'
const googleBooksEndpoint = 'https://www.googleapis.com/books/v1/volumes'

async function getGoogleBooks(search) {
  try {
    const response = await axios.get(
      `${googleBooksEndpoint}?q=${search}&maxResults=16`,
    )

    return response.data
  } catch (error) {
    const data = error.response ? error.response.data : error.request
    logger.error(data.error)
    throw new Error(`Unable to get books: ${data.error.message}`)
  }
}

async function getGoogleBook(googleBookId) {
  try {
    const response = await axios.get(`${googleBooksEndpoint}/${googleBookId}`)

    return response.data
  } catch (error) {
    const data = error.response ? error.response.data : error.request
    logger.error(data.error)
    throw new Error(`Unable to get book: ${data.error.message}`)
  }
}

export {getGoogleBooks, getGoogleBook}
