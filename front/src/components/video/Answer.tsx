import { useEffect, useRef, useState } from 'react'
import { socket } from '../../api/sockets/create'
import { configurationConnection } from '../../const/webRtc'

interface Props {}

export default function Answer({}: Props) {
  const [credential, setCredential] =
    useState<RTCSessionDescriptionInit | null>(null)

  const [connection, setConnection] = useState<RTCPeerConnection | null>(null)

 const videoOffer = useRef<HTMLVideoElement | null>(null)
 const videoAnswer = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const peerConnection = new RTCPeerConnection(configurationConnection)

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        // Agregar el stream al objeto RTCPeerConnection
        // consultar
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream)
        })

            if (!videoOffer.current) return
            videoOffer.current.srcObject = stream


        //  peerConnection
        //    .createOffer()
        //    .then(offer => {
        //      console.log(offer)
        //      peerConnection.setLocalDescription(offer)
        //      setCredential(offer)
        //    })

        // Crear una oferta (offer)
        return peerConnection.createOffer()
        // return peerConnection.createAnswer()
      })
      .then(offer => {
        // Establecer la descripción local (localDescription)
        return peerConnection.setLocalDescription(offer)
      })
      .then(() => {
        // Enviar la oferta al otro peer
        const offer = peerConnection.localDescription
        // ... Código para enviar la oferta ...

        socket.emit('call', offer)

        console.log(offer)
        console.log('offer', offer?.sdp)
        setCredential(offer)
      })
      .catch(err => console.error(err))

    // peerConnection.createOffer().then(offer => {
    //   console.log(offer)
    //   peerConnection.setLocalDescription(offer)
    //   setCredential(offer)
    // })

    console.log(peerConnection)
    setConnection(peerConnection)
  }, [])

  function handleDescription(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { value } = e.currentTarget.credential
    if (!connection) return

    const message: RTCSessionDescriptionInit = {
      type: 'offer',
      sdp: value,
    }

    connection
      .setRemoteDescription(message)
      .then(() => {
        // creando una respuesta
        return connection.createAnswer()
      })
      .then(answer => {
        // if (!answer) return
        console.log('nueva local description')
        connection.setLocalDescription(answer)
        setCredential(answer)
      })
      .catch(err => console.error(err))

    connection.onicecandidate = e => {
      console.log('buscando candidatos')
      console.log('ice candidate', e)
      const candidate = e.candidate
      if (!candidate || !connection) return
      console.log('candidato encontrado')
      console.log(candidate)
      connection.addIceCandidate(candidate).then(() => {
        console.log('candidato agregado')
      })
    }
  }

  return (
    <div>
      <video ref={videoOffer} autoPlay></video>
      <form onSubmit={handleDescription}>
        credential
        {/* <input type="text" name="credential" /> */}
        <textarea name="credential" cols={30} rows={10}></textarea>
        <button> enviar </button>
      </form>
      <button onClick={() => console.log(connection)}>status</button>
    </div>
  )
}
