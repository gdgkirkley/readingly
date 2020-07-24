import faker from 'faker'

const getEmail = faker.internet.email
const getAdmin = faker.random.boolean
const getFirstName = faker.name.firstName
const getLastName = faker.name.lastName
const getUserName = faker.internet.userName
const getId = faker.random.number
const getUUID = faker.random.uuid
const getNumber = faker.random.number

const getURL = faker.internet.url
const getImage = faker.image.imageUrl
const getDescription = faker.lorem.sentences
const getBookName = faker.commerce.productName
const getDate = faker.date.future

const getWord = faker.lorem.word
const getSentence = faker.lorem.sentence

async function buildBook({...overrides} = {}) {
  return {
    id: getId(),
    title: getBookName(),
    description: getDescription(),
    googleBooksId: getUUID(),
    pageCount: getNumber(),
    thumbnail: getImage(),
    publishDate: getNumber().toString(),
    authors: [getFirstName() + ' ' + getLastName()],
    ...overrides,
  }
}

async function buildAuthor({...overrides} = {}) {
  return {
    name: getFirstName() + ' ' + getLastName(),
    ...overrides,
  }
}

export {buildBook, buildAuthor, getDescription}
