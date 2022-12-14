const userService = require('./user.service')
const logger = require('../../services/logger.service')
const bcrypt = require('bcrypt')

async function getUser(req, res) {
  try {
    const user = await userService.getById(req.params.id)
    res.send(user)
  } catch (err) {
    logger.error('Failed to get user', err)
    res.status(500).send({ err: 'Failed to get user' })
  }
}

async function getUsers(req, res) {
  try {
    const filterBy = {
      loggedInUserId: req.query?.loggedInUserId || '',
    }
    const users = await userService.query(filterBy)
    res.send(users)
  } catch (err) {
    logger.error('Failed to get users', err)
    res.status(500).send({ err: 'Failed to get users' })
  }
}



async function updateUser(req, res) {
  try {
    const user = req.body
    const savedUser = await userService.update(user)
    res.send(savedUser)
  } catch (err) {
    logger.error('Failed to update user', err)
    res.status(500).send({ err: 'Failed to update user' })
  }
}
async function addUser(req, res) {
  try {
    const saltRounds = 10
    const user = req.body
    const { fullName, username, password, imgUrl  } = user
    
    
    const hash = await bcrypt.hash(password, saltRounds)
    const savedUser = await userService.add({ username, password: hash, imgUrl, fullName })
    res.send(savedUser)
  } catch (err) {
    logger.error('Failed to add user', err)
    res.status(500).send({ err: 'Failed to add user' })
  }
}
async function updateUserAll(req, res) {
  try {
    const user = req.body
    const savedUser = await userService.updateUserAll(user)
    res.send(savedUser)
  } catch (err) {
    logger.error('Failed to update all user', err)
    res.status(500).send({ err: 'Failed to update user' })
  }
}
async function removeUser(req, res) {
  try {
    const { id } = req.params
    const deletedCount = await userService.remove(id)
    if (!deletedCount) return res.status(401).send('Failed to remove user')
    res.send('user removed successfully')
  } catch (err) {
    // logger.error('Failed to remove user', err)
    res.status(500).send({ err: 'Failed to remove user ' })
  }
}


module.exports = {
  getUser,
  getUsers,
  updateUser,
  removeUser,
  updateUserAll,
  addUser,
}
