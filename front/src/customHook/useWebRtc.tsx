import { useEffect, useState } from 'react'
import { configurationConnection } from '../const/webRtc'

interface Props {}

export function useWebRtc({}: Props) {
  const [connect, setConnect] = useState<RTCPeerConnection | null>(null)
  useEffect(() => {
    const peerConnection = new RTCPeerConnection(configurationConnection)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream)
        })
        return peerConnection.createOffer()
      })
      .then(offer => {
        console.log(offer)
        console.log('offer', offer?.sdp)
        return peerConnection.setLocalDescription(offer)
      })
      .catch(err => console.error(err))
  }, [])
  return {}
}
