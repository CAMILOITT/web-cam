import { useState } from 'react'

interface IProps {
  statusCall: 'called' | 'calle'
}

export default function Video({ statusCall }: IProps) {
  const [credential, setCredential] =
    useState<RTCSessionDescriptionInit | null>(null)
  const [videoCall, setVideoCall] = useState('')
  const [connection, setConnection] = useState<RTCPeerConnection | null>(null)

  function handleCalled() {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.localhost:5173/' },
        // { urls: 'stun:stun.l.google.com:19302' },
      ],
    })
    peerConnection
      .createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
      .then(offer => {
        console.log(offer)
        peerConnection.setLocalDescription(offer)
        setCredential(offer)
      })
    console.log(peerConnection)
    setConnection(peerConnection)
  }
  function handleDescription(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!connection) return
    e.currentTarget.credential.value
    if (!e) return
    const newCredential = new RTCSessionDescription({
      type: 'offer',
      sdp: e.currentTarget.credential.value,
    })
    connection.setRemoteDescription(newCredential)

    connection
      ?.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
      .then(answer => {
        console.log(answer)
      })
    if (statusCall !== 'called') return
    connection.onicecandidate = event => {
      console.log(event)
    }
  }

  return (
    <div>
      <video src={videoCall} autoPlay></video>
      <div>
        <button onClick={handleCalled}>caller</button>
        <button>video</button>
        <button>voice</button>
      </div>
      <p>{credential && credential.sdp}</p>
      <form onSubmit={handleDescription}>
        credential
        <input type="text" name="credential" />
        <button> enviar </button>
      </form>
    </div>
  )
}
