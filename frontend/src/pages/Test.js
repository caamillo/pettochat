// React
import { useEffect } from 'react'

function Test() {
    useEffect(() => {
        const myVideoSource = document.createElement('video')
        myVideoSource.muted = true
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            const video = document.getElementsByTagName('video')[0]
            video.srcObject = stream
            video.play()
        })
    }, [])
    return (
        <>
            This is a test
            <video width='640' height='480' className='bg-[#000]' autoPlay></video>
        </>
    )
}

export default Test