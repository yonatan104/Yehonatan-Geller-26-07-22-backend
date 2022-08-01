
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const alsService= require('../../services/als.service')
const ObjectId = require('mongodb').ObjectId
const chatRoomService = require('../chatRoom/chatRoom.service')
module.exports = {
    query,
    getById,
    getByUser,
    update,
    add,
    remove
}

async function query(filterBy = {}) {
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find({ _id: { $nin: [ObjectId(filterBy.loggedInUserId)] } }).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password


        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}
async function getByUser(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}



async function update(user) {
    try {
        // peek only updatable properties
        const userToSave = {
            _id: ObjectId(user._id), // needed for the returnd obj
            friends: user.friends
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return user
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            imgUrl: user.imgUrl,
            fullName: user.fullName,
            friends: [],
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot insert user', user)
        throw err
    }
}
async function remove(userId) {
    try {
        const userToRemove = await getById(userId)
        if (userToRemove?.isAdmin) return res.status(401).send('Not Authenticated admin can not remove')
        await  removeUserFromUsersFriendList(userToRemove)

        const collection = await dbService.getCollection('user')
        const deletedCount = await collection.deleteOne({ _id: ObjectId(userId) })
        return deletedCount
    } catch (err) {
        console.log(`ERROR: cannot delete user (user.service - remove)`)
        throw err
    }
}

async function removeUserFromUsersFriendList(userToRemove) {
    try {
        userToRemove.friends.forEach(friend => {
            chatRoomService.remove(friend.sharedChatRoomId)
        })
        const { loggedInUser } = alsService.getStore()
        const users = await query({ loggedInUserId: loggedInUser._id })
        users.forEach(async(user) => {
            const friendsToUpdate = user.friends.filter(friend => friend._id !== userToRemove._id.toString())
                const userToUpdate = { ...user }
                userToUpdate.friends = [ ...friendsToUpdate ]
                await update(userToUpdate)
        });

    } catch (error) {
        console.error('can not update other documents ')
    }
}




