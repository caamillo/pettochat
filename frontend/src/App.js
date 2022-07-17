// React
import { useState, useEffect, useRef } from 'react'

// Tailwind
import './tailwind/tailwind.css'
import './tailwind/output.css'

function App() {

    const [uid, setUid] = useState()
    const [roomId, setRoomId] = useState()

    const myVid = useRef()
    const usrsVid = []

    useEffect(() => {
        // get UID and ROOMID
        if (localStorage.getItem('roomId') != null && localStorage.getItem('uid') != null) {
            setUid(localStorage.getItem('uid'));
            setRoomId(localStorage.getItem('roomId'))
        } else {
            // Fetch from server
        }


    }, [])

    return (
        <div className='h-full flex items-center justify-center'>
            <div id="video-grid" className='grid grid-cols-2 gap-4'>
            </div>
        </div>
    );
}

export default App;
