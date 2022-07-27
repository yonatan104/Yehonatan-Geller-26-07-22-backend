const Cryptr = require('cryptr')
require('dotenv').config()

const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const cryptr = new Cryptr(process.env.CRYPTER_KEY)

async function login(username, password) {
  logger.debug(`auth.service - login with username: ${username}`)

  const user = await userService.getByUser(username)
  if (!user) return Promise.reject('Invalid username or password')
  // TODO: un-comment for real login
  const match = await bcrypt.compare(password, user.password)
  if (!match) return Promise.reject('Invalid username or password')

  delete user.password
  return user
}

async function signup({ username, password, imgUrl, fullName }) {
  console.log("🚀 ~ file: auth.service.js ~ line 24 ~ signup ~ username", username, password, imgUrl, fullName)
  const saltRounds = 10

  logger.debug(
    `auth.service - signup with username: ${username}`
  )
  if (!username || !password || !fullName)
    return Promise.reject('username,  password, fullName and  imgUrl are required!')

  const hash = await bcrypt.hash(password, saltRounds)
  return userService.add({ username, password: hash, imgUrl, fullName })
}

function getLoginToken(user) {
  return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinuser = JSON.parse(json)
    return loggedinuser
  } catch (err) {
    console.log('Invalid login token')
  }
  return null
}

module.exports = {
  signup,
  login,
  getLoginToken,
  validateToken,
}
