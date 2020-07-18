import models from '../models'

const createUsers = async () => {
  await models.User.create({
    username: 'gkirkley',
  })

  await models.User.create({
    username: 'pfraser',
  })
}

export default createUsers
