const express = require('express')
const { requireAdmin } = require('../../middlewares/require.auth.middleware')
const { requireUserPasswordOrAdmin } = require('../../middlewares/require.user.middleware')
const { getUser, getUsers, updateUser, removeUser, updateUserAll } = require('./user.controller')
const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/', updateUser)
router.put('/all', requireUserPasswordOrAdmin, updateUserAll)
router.delete('/:id',requireAdmin, removeUser)


module.exports = router