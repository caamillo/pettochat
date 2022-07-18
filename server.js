const express = require('express')
const app = express()
const { Server } = require('socket.io')
const server = require('http').createServer(app)
const { v4: uuidV4 } = require('uuid')
const cors = require('cors')

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cors())

io.on('connection', socket => {

    socket.emit('get-room', link)

    // Subject to change
    socket.on('isvalid', link => {
        if (links.includes(link) || link == 'favicon.ico') socket.emit('isvalid', true)
        else socket.emit('isvalid', false)
    })

    socket.on('join-room', (roomId, userId) => {
        console.log(`user ${userId} joined ${roomId}`);

        socket.join(roomId)
        socket.on('ready',()=>{
            console.log('readyyy')
            socket.broadcast.to(roomId).emit('user-connected', userId);
        })

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
        
    })
})

server.listen(5000, '127.0.0.1', () => {
    console.log('Server started at: http://127.0.0.1:5000')
})