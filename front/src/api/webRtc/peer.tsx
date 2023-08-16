import { configurationConnection } from '../../const/webRtc'
import { socket } from '../sockets/create'

export class PeerConnection {
  private peer: RTCPeerConnection

  constructor() {
    this.peer = new RTCPeerConnection(configurationConnection)
  }

  public openPeer() {
    this.peer = new RTCPeerConnection(configurationConnection)
  }

  public closePeer() {
    this.peer.close()
  }

  public createOffer() {
    this.peer.createOffer()
  }

  public setLocalDescription(offer: RTCSessionDescriptionInit) {
    this.peer.setLocalDescription(offer)
  }

  public setRemoteDescription(answer: RTCSessionDescriptionInit) {
    this.peer.setRemoteDescription(answer)
  }

  public addTrack(stream: MediaStream) {
    stream.getTracks().forEach(track => {
      console.log('enviando datos')
      console.log(track)
      this.peer.addTrack(track, stream)
    })
  }

  public searchCandidates() {
    this.peer.onicecandidate = ev => {
      if (!ev.candidate) return
      console.log(ev.candidate)
      socket.emit('sendCandidate', localStorage.getItem('idRoom'), ev.candidate)
    }
  }

  public addCandidate(candidate: RTCIceCandidate) {
    this.peer.addIceCandidate(candidate)
  }
}
