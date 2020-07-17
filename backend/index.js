if (process.env.NODE_ENV === 'production') {
  require('./dist')
} else {
  require('dotenv').config()
  require('nodemon')({script: 'dev.js'})
}
