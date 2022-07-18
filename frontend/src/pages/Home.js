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

    const [uid, setUid] = useState()
    const [roomId, setRoomId] = useState()

    const myVid = useRef()
    const [myStream, setMyStream] = useState()

    const usrsVid = []

    const peers = {}
    const [videos, setVideos] = useState([])

    const { proom } = useParams()

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
            console.log('streaming')
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
                console.log('calling')
                call.answer(stream)
                const video = document.createElement('video')
                call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream)
                })
                socket.emit("ready")
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
            return
        }
        if (proom) {
            socket.emit('isvalid', proom);
            socket.on('isvalid', (res) => {
            console.log('proom valid:', res)
            if (res) setRoomId(proom)
            else window.location.href = '/'
        })
        }
        else
            if (roomId == null) socket.on('get-room', roomId => setRoomId(roomId))
            if (uid == null) myPeer.on('open', uid => setUid(uid))
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
                { videos.map(v => <video className='bg-[#000]' key={ v.srcObject.id }></video>) }
            </div>
        </div>
        </>
    );
}

export default Home;
