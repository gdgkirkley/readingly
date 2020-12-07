import faker from "faker";
import { User } from "../graphql/user";
import { Book } from "../graphql/books";
import { BookShelf } from "../graphql/bookshelves";
import { Reading } from "../graphql/reading";
import { Goal, GoalStatus, GoalType } from "../graphql/goal";

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

const getDateString = () => {
  return getDate().toISOString();
};

async function buildBook({ ...overrides } = {}): Promise<Book> {
  const goal = await buildGoal();
  return {
    title: getWord(),
    googleBooksId: getUUID(),
    description: getSentence(),
    authors: [`${getFirstName()} ${getLastName()}`],
    thumbnail: getImage(),
    pageCount: getNumber(),
    publishDate: getSentence(),
    categories: [`${getWord()}`],
    createdAt: getDateString(),
    updatedAt: getDateString(),
    averageRating: getNumber().toString(),
    publisher: getWord(),
    bookshelves: [],
    reading: [],
    averageTimeToReadInSeconds: getNumber(),
    goal: goal,
    ...overrides,
  };
}

async function buildUser({ ...overrides } = {}): Promise<User> {
  return {
    id: getId().toString(),
    username: getUserName(),
    email: getEmail(),
    ...overrides,
  };
}

async function buildBookshelf({ ...overrides } = {}): Promise<BookShelf> {
  const book1 = await buildBook();
  const book2 = await buildBook();
  const book3 = await buildBook();
  const goal = await buildGoal();

  return {
    id: getId().toString(),
    title: getWord(),
    createdAt: getDateString(),
    bookCount: getNumber(),
    books: [book1, book2, book3],
    averageTimeToReadInSeconds: getNumber(),
    goal: goal,
    ...overrides,
  };
}

async function buildReading({ ...overrides } = {}): Promise<Reading> {
  const user = await buildUser();
  const book = await buildBook();
  return {
    id: getId().toString(),
    progress: getNumber(),
    timeRemainingInSeconds: getNumber(),
    book,
    user,
    createdAt: getDateString(),
    updatedAt: getDateString(),
    ...overrides,
  };
}

async function buildGoal({ ...overrides } = {}): Promise<Goal> {
  // const book = await buildBook();
  return {
    id: getId().toString(),
    goalDate: getDateString(),
    goalable: null,
    goalableId: getUUID(),
    goalableType: GoalType.Book,
    startDate: getDateString(),
    endDate: getDateString(),
    status: GoalStatus.InProgress,
    readingRecommendation: getNumber(),
    readingRecommendationSeconds: getNumber(),
    ...overrides,
  };
}

export {
  buildBook,
  buildUser,
  buildBookshelf,
  buildReading,
  buildGoal,
  getUUID,
};
