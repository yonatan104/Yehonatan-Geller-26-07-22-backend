const express = require('express')
const { requireAdmin } = require('../../middlewares/require.auth.middleware')
const { getUser, getUsers, updateUser, removeUser } = require('./user.controller')
const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id',requireAdmin, removeUser)


module.exports = router