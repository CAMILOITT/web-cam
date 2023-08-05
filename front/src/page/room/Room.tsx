import { useEffect, useRef, useState } from 'react'
import { socket } from '../../api/sockets/create'
import { configurationConnection } from '../../const/webRtc'

interface IProps {}

const constrains = {
  audio: true,
  video: true,
}

export default function Room({}: IProps) {
  const [user, setUser] = useState()

  const [peer, setPeer] = useState<RTCPeerConnection>()

  // const peer = useRef(new RTCPeerConnection(configurationConnection))

  // const idRoom = useRef(localStorage.getItem('idRoom'))

  const VideoLocal = useRef<HTMLVideoElement | null>(null)
  const VideoRemote = useRef<HTMLVideoElement | null>(null)

  const [localStream, setLocalStream] = useState<MediaStream>()

  // el usuario se conecta al room
  useEffect(() => {
    socket.on('userJoin', userCall => {
      setUser(userCall)
    })
  }, [])

  // conectando cámara y micrófono
  useEffect(() => {
    setPeer(new RTCPeerConnection(configurationConnection))
    navigator.mediaDevices
      .getUserMedia(constrains)
      .then(stream => {
        // si no funciona agregar el stream en un useState en la linea donde el pc1 recibe la respuesta de la conexión peer y le agrega al la descriptionLocal()
        if (!VideoLocal.current) return
        VideoLocal.current.srcObject = stream
        setLocalStream(stream)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  // inicia la reunion
  function initRoom() {
    if (!peer) return
    peer
      .createOffer()
      .then(offer => {
        peer.setLocalDescription(offer).catch(err => {
          console.error(err)
        })
        socket.emit('offer', localStorage.getItem('idRoom'), offer)
      })
      .catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    socket.on('offer', offer => {
      if (!peer) return
      peer.setRemoteDescription(offer).catch(err => {
        console.error(err)
      })

      // navigator.mediaDevices
      //   .getUserMedia(constrains)
      //   .then(stream => {
      //     if (!VideoAns.current) return
      //     VideoAns.current.srcObject = stream
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })

      // eslint-disable-next-line no-debugger
      // debugger

      peer
        .createAnswer()
        .then(answer => {
          if (!peer) return

          peer.setLocalDescription(answer)
          // .catch(err => console.error(err))

          socket.emit('answer', localStorage.getItem('idRoom'), answer)
        })
        .catch(err => {
          console.error(err)
        })
    })

    socket.on('answer', answer => {
      if (!peer) return
      peer.setRemoteDescription(answer).catch(err => {
        console.error(err)
      })
    })
  }, [peer])

  useEffect(() => {
    if (!peer || !localStream) return
    localStream.getTracks().forEach(track => {
      peer.addTrack(track, localStream)
      console.log(track)
    })
  }, [peer, localStream])

  // obtiene el sonido del usuario
  useEffect(() => {
    if (!peer) return
    // peer.addEventListener('track', ev => {
    //   console.log(ev)
    //   console.log(ev.streams)
    //   // a;adir el parámetro a un useState() trackRemote
    //   if (!VideoRemote.current) return
    //   VideoRemote.current.srcObject = ev.streams[0]
    // })

    peer.ontrack = ev => {
      console.log(ev)
      console.log(ev.streams)
      // a;adir el parámetro a un useState() trackRemote
      if (!VideoRemote.current) return
      VideoRemote.current.srcObject = ev.streams[0]
    }
  }, [peer])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1em',
      }}
    >
      <h1>Room</h1>
      <h2>{!user ? 'No hay Usuarios' : 'Hay Usuarios'}</h2>
      <p>{user}</p>
      <button onClick={() => console.info(peer)}>estado del peer</button>
      {<button onClick={initRoom}>Iniciar Reunion</button>}
      {/* <button onClick={initRoom}>iniciar reunion</button> */}
      <video
        ref={VideoLocal}
        style={{ width: '400px' }}
        controls
        muted
        autoPlay
      ></video>
      <video
        ref={VideoRemote}
        style={{ width: '400px' }}
        controls
        muted
        autoPlay
      ></video>
    </div>
  )
}
