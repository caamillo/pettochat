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
const links = []

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cors())

app.get('/:room', (req, res) => {
    if (links.includes(req.params.room) || req.params.room == 'favicon.ico') res.json({ roomId: req.params.room })
    else res.status(404).json({ roomId: null })
})

io.on('connection', socket => {
    const link = uuidV4()
    links.push(link)
    console.log('connection', link)
    socket.emit('get-room', link)
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