
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    getById,
    update,
    add,
    remove,
    query
}
async function query() {
    try {
        const collection = await dbService.getCollection('chatRoom')
        var chatRooms = await collection.find({}).toArray()
        chatRooms = chatRooms.map(chatRoom => {
            delete chatRoom.messages
            //never return private messages to admin
            return chatRoom
        })
        return chatRooms
    } catch (err) {
        logger.error('cannot find chatRooms', err)
        throw err
    }
}


async function getById(chatRoomId) {
    try {
        const collection = await dbService.getCollection('chatRoom')
        const chatRoom = await collection.findOne({ _id: ObjectId(chatRoomId) })
        return chatRoom
    } catch (err) {
        logger.error(`while finding chatRoom ${chatRoomId}`, err)
        throw err
    }
}


async function update(chatRoom) {
    try {
        // peek only updatable properties
        const chatRoomToSave = {
            _id: ObjectId(chatRoom._id), // needed for the returnd obj
            messages: chatRoom.messages,     
            miniUsers: chatRoom.miniUsers
        }
        const collection = await dbService.getCollection('chatRoom')
        await collection.updateOne({ _id: chatRoomToSave._id }, { $set: chatRoomToSave })
        return chatRoomToSave
    } catch (err) {
        logger.error(`cannot update chatRoom ${chatRoom._id}`, err)
        throw err
    }
}

async function add(chatRoom) {
    try {
        const chatRoomToAdd = {
            miniUsers: chatRoom.miniUsers,
            messages: chatRoom.messages,
        }
        const collection = await dbService.getCollection('chatRoom')
        await collection.insertOne(chatRoomToAdd)
        return chatRoomToAdd
    } catch (err) {
        logger.error('cannot insert charRoom', chatRoom)
        throw err
    }
}

async function remove(chatRoomId) {
    try {
        const collection = await dbService.getCollection('chatRoom')
        const deletedCount = await collection.deleteOne({ _id: ObjectId(chatRoomId) })
        return deletedCount
    } catch (err) {
        console.log(`ERROR: cannot delete chat room)`)
        throw err
    }
}







