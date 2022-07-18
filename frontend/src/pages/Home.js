// React
import { useState, useEffect, useRef } from 'react'

// Tailwind
import '../tailwind/tailwind.css'
import '../tailwind/output.css'

// Socket
import io from 'socket.io-client'

// Peerjs
import { Peer } from "peerjs";

const socket = io.connect('http://localhost:5000')
console.log(socket)

function App() {

    const [uid, setUid] = useState()
    const [roomId, setRoomId] = useState()

    const myVid = useRef()
    const [myStream, setMyStream] = useState()

    const usrsVid = []

    const myPeer = new Peer(undefined, {
        host: '/',
        port: '5001'
    })

    const peers = {}
    const [videos, setVideos] = useState([])

    const addVideoStream = (video, stream) => {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        setVideos([...videos, video])
    }

    const connectToNewUser = (userId, stream) => {
        const call = myPeer.call(userId, stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        call.on('close', () =>  {
            video.remove()
        })
        peers[userId] = call
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

            myPeer.on('call', call => {
                call.answer(stream)
                const video = document.createElement('video')
                call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream)
                })
            })

            socket.on('user-connected', userId => {
                console.log('test')
                connectToNewUser(userId, stream)
            })
        })
    }, [])

    useEffect(() => {
        // get UID and ROOMID
        if (localStorage.getItem('roomId') != null && localStorage.getItem('uid') != null) {
            setUid(localStorage.getItem('uid'));
            setRoomId(localStorage.getItem('roomId'))
        } else {
            socket.on('get-room', roomId => {
                setRoomId(roomId)
            })
            myPeer.on('open', (id) => {
                setUid(id)
            })
        }
    }, [])

    useEffect(() => {
        console.log(uid, roomId)
        if (uid == null || roomId == null) return console.log('Error Room / UID')
        socket.emit('join-room', roomId, uid)
        console.log('connected')
    }, [uid, roomId])

    useEffect(() => {
        const videosDisplayed = document.getElementsByTagName('video')
        let c = 0
        for (const vid of videosDisplayed) {
            vid.srcObject = videos[c].srcObject
            c += 1
        }
    }, [videos])

    return (
        <>
        <p>Room ID: { roomId }</p>
        <p>UID: { uid }</p>
            <div className='h-full flex items-center justify-center'>
                <div id="video-grid" className='grid grid-cols-2 gap-4'>
                    { videos.map(v => <video key={ v.srcObject.id }></video>) }
                </div>
            </div>
        </>
    );
}

export default App;
