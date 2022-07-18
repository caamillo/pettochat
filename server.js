const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: [ 'GET', 'POST' ]
    }
})
const { v4: uuidV4 } = require('uuid')

const links = []

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/:room', (req, res) => {
    if (links.includes(req.params.room) || req.params.room == 'favicon.ico') res.json({ roomId: req.params.room })
    else res.status(404).json({ roomId: null })
})

io.on('connection', socket => {
    const link = uuidV4()
    links.push(link)
    socket.emit('get-room', link)
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(5000, '127.0.0.1', () => {
    console.log('Server started at: http://127.0.0.1:5000')
})