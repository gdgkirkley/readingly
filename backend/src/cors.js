export function corsOrigins() {
  return {
    origin:
      process.env.NODE_ENV === 'production' ? [] : ['http://localhost:3000'],
    optionsSuccessStatus: 200,
    credentials: true,
  }
}
