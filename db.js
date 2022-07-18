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

module.exports = {
    Connect,
    RoomsModel
}