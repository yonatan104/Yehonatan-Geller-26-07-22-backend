const express = require('express')
const { requireAdmin } = require('../../middlewares/require.auth.middleware')
const { getChatRoom, addChatRoom, updateChatRoom, getChatRooms } = require('./chatRoom.controller')
const router = express.Router()

router.get('/:id', getChatRoom)
router.get('/', requireAdmin, getChatRooms)
router.post('/', addChatRoom)
router.put('/:id', updateChatRoom)


module.exports = router