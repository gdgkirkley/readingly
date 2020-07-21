require('dotenv').config()
const models = require('../src/models')

afterAll(() => models.sequelize.close())
