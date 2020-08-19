export function corsOrigins() {
  return {
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://readingly.ca', 'https://www.readingly.ca']
        : ['http://localhost:3000'],
    optionsSuccessStatus: 200,
    credentials: true,
  }
}
