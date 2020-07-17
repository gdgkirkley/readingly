import logger from 'loglevel'

function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    next(error)
  } else {
    logger.error(error)

    res.status(500)
    res.json({
      message: error.message,
      ...(process.env.NODE_ENV === 'production' ? null : {stack: error.stack}),
    })
  }
}

export default errorMiddleware
