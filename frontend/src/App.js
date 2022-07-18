// React
import { useState, useEffect, useRef } from 'react'

// Tailwind
import './tailwind/tailwind.css'
import './tailwind/output.css'

// Socket
import io from 'socket.io-client'

// Peerjs
import { Peer } from "peerjs";

const socket = io.connect('http://localhost:5000', {transports: ['websocket', 'polling', 'flashsocket']})

function App() {

    const [uid, setUid] = useState()
    const [roomId, setRoomId] = useState()

    const myVid = useRef()
    const [myStream, setMyStream] = useState()

    const usrsVid = []

    const socket = io('/')
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
        console.log(videos)
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
        })
    }, [])

    useEffect(() => {
        // get UID and ROOMID
        if (localStorage.getItem('roomId') != null && localStorage.getItem('uid') != null) {
            setUid(localStorage.getItem('uid'));
            setRoomId(localStorage.getItem('roomId'))
        } else {
            console.log(socket)
            socket.on('get-room', roomId => {
                setRoomId(roomId)
            })
            myPeer.on('open', id => {
                setUid(id)
                socket.emit('join-room', roomId, id)
            })
        }

        if (uid == null || roomId == null) return console.log('Error Room / UID', uid, roomId)
        console.log(uid, roomId)

    }, [])

    useEffect(() => {
        const videosDisplayed = document.getElementsByTagName('video')
        let c = 0
        for (const vid of videosDisplayed) {
            console.log('update videos')
            console.log(videos[c].srcObject)
            vid.srcObject = videos[c].srcObject
            c += 1
        }
    }, [videos])

    return (
        <div className='h-full flex items-center justify-center'>
            <div id="video-grid" className='grid grid-cols-2 gap-4'>
                { videos.map(v => <video key={ v.srcObject.id }></video>) }
            </div>
        </div>
    );
}

export default App;
