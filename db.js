const mongoose = require('mongoose')

const Connect = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/pettochat', { autoIndex: true })
    } catch (ex) {
        console.error(`MongoDB connection error:\n${ex}`)
        process.exit(1)
    }
}

const RoomsModel = mongoose.model('rooms', mongoose.Schema({}, { strict: false }))

// Helpful functions
const getRoomById = async (id) => await RoomsModel.findOne({ _id: mongoose.Types.ObjectId(id) })

// Test Function
const getTestRoom = async () => (await RoomsModel.findOne({ _id: mongoose.Types.ObjectId('62d5a47ed8635df5104e07b9') }))

module.exports = {
    Connect,
    RoomsModel,
    getRoomById,
    getTestRoom
}