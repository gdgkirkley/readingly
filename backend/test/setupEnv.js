require('dotenv').config()
const {sequelize} = require('../src/models')
const {resetDb} = require('./dbUtils.js')

afterEach(async () => await resetDb())

//afterAll(async () => await sequelize.close())
