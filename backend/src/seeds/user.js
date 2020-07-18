import models from '../models'

const createUsers = async () => {
  await models.User.create({
    username: 'gkirkley',
    email: 'gkirkley@readingly.com',
    password: 'gkirkley',
    role: 'ADMIN',
  })

  await models.User.create({
    username: 'pfraser',
    email: 'pfraser@readingly.com',
    password: 'pfraser',
  })
}

export default createUsers
