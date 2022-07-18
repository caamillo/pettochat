// React
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

// Tailwind
import '../tailwind/tailwind.css'
import '../tailwind/output.css'

// Socket
import io from 'socket.io-client'

const socket = io.connect('http://localhost:5000')
console.log(socket)

function Home() {

    const [user, setUser] = useState()
    const [room, setRoom] = useState()

    const myVid = useRef()
    const [myStream, setMyStream] = useState()

    const usrsVid = []

    const peers = {}
    const [videos, setVideos] = useState([])

    const [isConnected, setIsConnected] = useState(false)

    const { proom } = useParams()

    const getRoomId = () => room._id.toString()

    const addVideoStream = (video, stream) => {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        setVideos([...videos, video])
    }

    // Init vids
    useEffect(() => {
        const myVideoSource = document.createElement('video')
        myVideoSource.muted = true
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            setMyStream(stream)
            addVideoStream(myVideoSource, stream)

            socket.on('user-connected', userId => {
                console.log('user connected', userId.substring(0,3))
            })
        })
    }, [])

    useEffect(() => {
        // get user and room
        if (localStorage.getItem('room') != null && localStorage.getItem('user') != null) {
            setUser(localStorage.getItem('user'));
            setRoom(localStorage.getItem('room'))
            return
        }
        if (proom) {
            socket.emit('isvalid', proom);
            socket.on('isvalid', (res) => {
                console.log('proom valid:', res)
                if (res) setRoom(proom)
                else window.location.href = '/'
            })
        } else if (room == null || user == null) socket.on('get-room', ([room, user]) => {setRoom(room); setUser(user)})
    }, [])

    useEffect(() => {
        console.log(user, room)
        if (user == null || room == null) return console.log('Error Room / User')
        socket.emit('join-room', getRoomId(), user)
        console.log('connected')
        setIsConnected(true)
    }, [user, room])

    useEffect(() => {
        const videosDisplayed = document.getElementsByTagName('video')
        let c = 0
        for (const vid of videosDisplayed) {
            vid.srcObject = videos[c].srcObject
            c += 1
        }
    }, [videos])

    return (
        <div className='m-4'>
        <p>room_name: { room && room.name }</p>
        <p>room_id: { room && getRoomId() }</p>
        <p>uid: { user }</p>
        <p>State: { isConnected ? 'Connected' : 'Not Connected' }</p>
        <div className='h-full flex items-center justify-center m-5'>
            <div id="video-grid" className='grid grid-cols-2 gap-4'>
                { videos.map(v => <video className='bg-[#000]' key={ v.srcObject.id }></video>) }
            </div>
        </div>
        </div>
    );
}

export default Home;
