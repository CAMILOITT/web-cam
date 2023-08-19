import { configurationConnection } from '../../const/webRtc'
import { socket } from '../sockets/create'

export default class PeerConnection {
  private peer: RTCPeerConnection
  constructor() {
    this.peer = new RTCPeerConnection(configurationConnection)
  }

  // peer open
  public openPeer() {
    // signalingState
    if (this.peer.signalingState !== 'closed') return
    this.peer = new RTCPeerConnection(configurationConnection)
  }
  // peer close
  public closePeer() {
    this.peer.close()
  }

  // create offer answer

  public createLocalOffer() {
    this.peer
      .createOffer()
      .then(offer => {
        this.peer.setLocalDescription(offer).catch(err => {
          console.error(err)
        })
        socket.emit('offer', localStorage.getItem('idRoom'), offer)
      })
      .catch(err => {
        console.error(err)
      })
  }

  public createLocalAnswer(answer: RTCSessionDescriptionInit) {
    this.peer.setRemoteDescription(answer).catch(err => {
      console.error(err)
    })
  }

  public createRemoteOfferAndAnswer(offer: RTCSessionDescriptionInit) {
    this.peer.setRemoteDescription(offer).catch(err => {
      console.error(err)
    })

    this.peer
      .createAnswer()
      .then(answer => {
        this.peer.setLocalDescription(answer)
        socket.emit('answer', localStorage.getItem('idRoom'), answer)
      })
      .catch(err => {
        console.error(err)
      })
  }

  // peer audio Video

  public removeTrack() {
    this.peer.removeTrack(this.peer.getSenders()[0])
    this.peer.getSenders().forEach(track => {
      this.peer.removeTrack(track)
    })
    this.createLocalOffer()
  }

  public addTrack(stream: MediaStream) {
    stream.getTracks().forEach(track => {
      this.peer.addTrack(track, stream)
    })
  }

  public onTrack(Video: React.MutableRefObject<HTMLVideoElement | null>) {
    this.peer.ontrack = ev => {
      if (!Video.current) return
      Video.current.srcObject = ev.streams[0]
    }
  }

  //  peer candidate

  public searchCandidates() {
    this.peer.onicecandidate = ev => {
      if (!ev.candidate) return
      socket.emit('sendCandidate', localStorage.getItem('idRoom'), ev.candidate)
    }
  }

  public addCandidate(candidate: RTCIceCandidate) {
    if (!candidate) return
    this.peer.addIceCandidate(candidate).catch(err => {
      console.error(err)
    })
  }

  public searchErrorCandidate() {
    this.peer.onicecandidateerror = ev => {
      console.error(ev)
    }
  }

  // events peer

  public connectionstatechange() {
    this.peer.onconnectionstatechange = () => {
      console.log('connection state', this.peer.connectionState)

      if (this.peer.connectionState === 'disconnected') {
        console.log('usuario salio de la reunion')
      }
    }
  }

  public iceConnectionStateChange() {
    this.peer.oniceconnectionstatechange = () => {
      console.log('ice connection state', this.peer.iceConnectionState)
    }
  }
  public gatheringStateChange() {
    this.peer.onicegatheringstatechange = () => {
      console.log('ice gathering state', this.peer.iceGatheringState)
    }
  }

  public signalingStateChange() {
    this.peer.onsignalingstatechange = () => {
      console.log('signaling state', this.peer.signalingState)
    }
  }

  public getSenders() {
    return this.peer.getSenders()
  }

  public getReceivers() {
    return this.peer.getReceivers()
  }
}
