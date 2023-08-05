import { useEffect, useRef, useState } from 'react'
import { configurationConnection } from '../../const/webRtc'
import css from './Offer.module.css'
import { socket } from '../../api/sockets/create'
interface IProps {}

export default function Offer({}: IProps) {
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
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream)
        })
        if (!videoOffer.current) return
        videoOffer.current.srcObject = stream

        return peerConnection.createOffer()
      })
      .then(offer => {
        return peerConnection.setLocalDescription(offer)
      })
      .then(() => {
        const offer = peerConnection.localDescription
        if (!offer) return
        socket.emit('offer', offer)
        setCredential(offer)
      })
      .catch(err => console.error(err))

    // no se ejecuta al principio
    // peerConnection.onconnectionstatechange = handleConnectionStateChange

    // peerConnection.oniceconnectionstatechange = handleIceConnectionStateChange

    // peerConnection.onicecandidateerror = handleIceCandidateError

    // peerConnection.onnegotiationneeded = handleNegotiationNeeded

    // peerConnection.onsignalingstatechange = handleSignalingStateChange
    // // obteniendo datos del otro peer

    // peerConnection.ontrack = e => {
    //   if (!videoAnswer.current) return
    //   videoAnswer.current.srcObject = e.streams[0]
    // }

    console.log(peerConnection)

    setConnection(peerConnection)
  }, [])

  function handleCalled() {
    const peerConnection = new RTCPeerConnection(configurationConnection)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        // Agregar el stream al objeto RTCPeerConnection
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream)
        })
        if (!videoOffer.current) return
        videoOffer.current.srcObject = stream

        return peerConnection.createOffer()
      })
      .then(offer => {
        return peerConnection.setLocalDescription(offer)
      })
      .then(() => {
        const offer = peerConnection.localDescription
        if (!offer) return
        setCredential(offer)
      })
      .catch(err => console.error(err))

    // no se ejecuta al principio
    // peerConnection.onconnectionstatechange = handleConnectionStateChange

    // peerConnection.oniceconnectionstatechange = handleIceConnectionStateChange

    // peerConnection.onicecandidateerror = handleIceCandidateError

    // peerConnection.onnegotiationneeded = handleNegotiationNeeded

    // peerConnection.onsignalingstatechange = handleSignalingStateChange
    // // obteniendo datos del otro peer

    // peerConnection.ontrack = e => {
    //   if (!videoAnswer.current) return
    //   videoAnswer.current.srcObject = e.streams[0]
    // }

    console.log(peerConnection)

    setConnection(peerConnection)
  }

  useEffect(() => {
    socket.on('answer', handleDescription)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleDescription(e: string) {
    if (!connection) return

    // por que hace la oferta
    const message: RTCSessionDescriptionInit = {
      type: 'answer',
      sdp: e,
    }

    connection.setRemoteDescription(message).catch(err => console.error(err))

    connection.onicecandidate = e => {
      console.log('buscando candidatos')
      console.log('ice candidate', e)
      const candidate = e.candidate
      if (!candidate || !connection) {
        console.log('el candidato no fue encontrado')
        return
      }
      console.log('candidato encontrado')
      console.log(candidate)
      connection.addIceCandidate(candidate).then(() => {
        console.log('candidato agregado')
      })
    }
  }

  return (
    <main className={css.main}>
      <video ref={videoAnswer} autoPlay className={css.videoAnswer}></video>
      <video ref={videoOffer} autoPlay className={css.videoOffer}></video>
      <div className={css.containerHandleCall}>
        <button onClick={handleCalled}>caller</button>
        <button>video</button>
        <button>voice</button>
      <button onClick={() => console.log(connection)}>status</button>
      </div>
    </main>
  )
}
