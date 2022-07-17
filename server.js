const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

const links = []

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    const link = uuidV4()
    links.push(link)
    res.redirect(`/${link}`)
})

app.get('/:room', (req, res) => {
    if (links.includes(req.params.room) || req.params.room == 'favicon.ico') res.render('room', { roomId: req.params.room })
    else res.redirect('/')
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(3000, '127.0.0.1', () => {
    console.log('Server started at: http://127.0.0.1:3000')
})