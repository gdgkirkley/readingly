import faker from "faker";
import { User } from "../graphql/user";
import { GoogleBook } from "../graphql/books";

const getEmail = faker.internet.email;
const getAdmin = faker.random.boolean;
const getFirstName = faker.name.firstName;
const getLastName = faker.name.lastName;
const getUserName = faker.internet.userName;
const getId = faker.random.number;
const getUUID = faker.random.uuid;
const getNumber = faker.random.number;

const getURL = faker.internet.url;
const getImage = faker.image.imageUrl;
const getDescription = faker.lorem.sentences;
const getEventName = faker.commerce.productName;
const getDate = faker.date.future;

const getWord = faker.lorem.word;
const getSentence = faker.lorem.sentence;

async function buildBook({ ...overrides } = {}): Promise<GoogleBook> {
  return {
    id: getId(),
    title: getWord(),
    googleBooksId: getUUID(),
    description: getSentence(),
    authors: [`${getFirstName()} ${getLastName()}`],
    thumbnail: getImage(),
    pageCount: getNumber(),
    publishDate: getSentence(),
    categories: [`${getWord()}`],
    createdAt: getDate(),
    updatedAt: getDate(),
    ...overrides,
  };
}

async function buildUser({ ...overrides } = {}): Promise<User> {
  return {
    id: getId(),
    username: getUserName(),
    email: getEmail(),
    ...overrides,
  };
}

export { buildBook, buildUser };
