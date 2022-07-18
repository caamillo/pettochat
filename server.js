const mongoose = require('mongoose')
const express = require('express')
const app = express()
const { Server } = require('socket.io')
const server = require('http').createServer(app)
const cors = require('cors')
const db = require('./db')

// Socket Init
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

// Use Cors
app.use(cors())

// DB Connection
;(async () => {
    await db.Connect()
})()

// Socket Connetion
io.on('connection', async (socket) => {

    socket.emit('get-room', [await db.getTestRoom(), socket.id]) // Connect To Test-Room

    socket.on('isvalid', async (id) => {
        const res = await db.RoomsModel.findOne({ _id: mongoose.Types.ObjectId(id) })
        if (res != null) return socket.emit('isvalid', [res, socket.id])
        socket.emit('isvalid', res)
    })

    socket.on('join-room', (roomId, userId, stream) => {
        console.log(`user ${userId.substring(0,3)} joined ${roomId.substring(0,3)}`);

        socket.join(roomId)
        console.log(stream)
        socket.broadcast.to(roomId).emit('user-connected', userId, stream);

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
        
    })
})

server.listen(5000, '127.0.0.1', () => {
    console.log('Server started at: http://127.0.0.1:5000')
})