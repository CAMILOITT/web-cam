import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../api/sockets/create'
import ControlsCall from '../../components/controlsCall/ControlsCall'
import Messages from '../../components/messages/Messages'
import { Video } from '../../components/video/Video'
import { configurationConnection } from '../../const/webRtc'
// import { PeerConnection as connect } from '../../api/webRtc/peer'
import css from './Room.module.css'
interface IProps {}

const constrains = {
  audio: true,
  video: true,
}

// const PeerConnection = new connect().openPeer()

const PeerConnection = new RTCPeerConnection(configurationConnection)

export default function Room({}: IProps) {
  const navigate = useNavigate()
  const VideoLocal = useRef<HTMLVideoElement | null>(null)
  const VideoRemote = useRef<HTMLVideoElement | null>(null)
  // const [localStream, setLocalStream] = useState<MediaStream>()
  const [message, setMessage] = useState('')
  const [hiddenMessage, setHiddenMessage] = useState(true)

  useEffect(() => {
    // const PeerConnection = new RTCPeerConnection(configurationConnection)

    // console.log(peerConnection)
    // navigator.mediaDevices.enumerateDevices().then(devices => {
    //   console.log(devices)
    //   const hasMicrophone = devices.some(device => device.kind === 'audioinput')
    //   const hasVideo = devices.some(device => device.kind === 'videoinput')
    //   const configuration = {
    //     audio: hasMicrophone,
    //     video: hasVideo,
    //   }
    // })

    // setPeer(PeerConnection)
    navigator.mediaDevices
      .getUserMedia(constrains)
      .then(stream => {
        if (!VideoLocal.current) return
        VideoLocal.current.srcObject = stream
        // setLocalStream(stream)
        stream.getTracks().forEach(track => {
          console.log('enviando datos')
          console.log(track)
          PeerConnection.addTrack(track, stream)
        })
      })
      .catch(err => {
        console.error(err)
      })

    PeerConnection.onconnectionstatechange = () => {
      console.log('connection state', PeerConnection.connectionState)
    }
    PeerConnection.oniceconnectionstatechange = () => {
      console.log('ice connection state', PeerConnection.iceConnectionState)
    }

    PeerConnection.onicecandidateerror = ev => {
      console.error('ice candidate error', ev)
    }

    PeerConnection.onicegatheringstatechange = () => {
      console.log('ice gathering state', PeerConnection.iceGatheringState)
    }
    PeerConnection.onsignalingstatechange = () => {
      console.log('signaling state', PeerConnection.signalingState)
    }

    PeerConnection.onicecandidate = ev => {
      if (!ev.candidate) return
      console.log(ev.candidate)
      socket.emit('sendCandidate', localStorage.getItem('idRoom'), ev.candidate)
    }

    PeerConnection.onnegotiationneeded = ev => {
      console.log('necesita negociación')
      console.log('negotiation needed', ev)
    }

    socket.on('offer', offer => {
      PeerConnection.setRemoteDescription(offer).catch(err => {
        console.error(err)
      })
      PeerConnection.createAnswer()
        .then(answer => {
          PeerConnection.setLocalDescription(answer)
          socket.emit('answer', localStorage.getItem('idRoom'), answer)
        })
        .catch(err => {
          console.error(err)
        })
    })

    socket.on('answer', answer => {
      PeerConnection.setRemoteDescription(answer).catch(err => {
        console.error(err)
      })
    })

    socket.on('sendCandidate', candidate => {
      if (!candidate) return

      PeerConnection.addIceCandidate(candidate)
        .then(() => {
          console.log('candidate added')
        })
        .catch(err => {
          console.log(err)
        })
    })

    return () => {
      socket.off('offer')
      socket.off('answer')
      socket.off('sendCandidate')
    }
  }, [])

  useEffect(() => {
    socket.on('userJoin', (userRemote: string) => {
      sessionStorage.setItem('userRemote', userRemote)

      socket.emit(
        'infoRoom',
        localStorage.getItem('idRoom'),
        sessionStorage.getItem('userLocal')
      )
      initRoom()
    })

    socket.on('infoRoom', (userRemote: string) => {
      sessionStorage.setItem('userRemote', userRemote)
    })
    return () => {
      socket.off('userJoin')
      socket.off('infoRoom')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   socket.on('offer', offer => {
  //     if (!peer) return
  //     peer.setRemoteDescription(offer).catch(err => {
  //       console.error(err)
  //     })
  //     peer
  //       .createAnswer()
  //       .then(answer => {
  //         if (!peer) return

  //         peer.setLocalDescription(answer)
  //         socket.emit('answer', localStorage.getItem('idRoom'), answer)
  //       })
  //       .catch(err => {
  //         console.error(err)
  //       })
  //   })

  //   socket.on('answer', answer => {
  //     if (!peer) return
  //     peer.setRemoteDescription(answer).catch(err => {
  //       console.error(err)
  //     })
  //   })

  //   socket.on('sendCandidate', candidate => {
  //     if (!peer) return

  //     console.log('candidato añadido')
  //     peer.addIceCandidate(candidate)
  //   })
  // }, [peer])

  // useEffect(() => {
  //   if (!peer || !localStream) return
  //   localStream.getTracks().forEach(track => {
  //     console.log('enviando datos')
  //     console.log(track)
  //     peer.addTrack(track, localStream)
  //   })
  // }, [peer, localStream])

  // obtiene el sonido del usuario remote
  useEffect(() => {
    if (!VideoRemote.current) return
    PeerConnection.ontrack = ev => {
      console.log('recibiendo datos')
      console.log(ev)
      console.log(ev.streams)
      // a;adir el parámetro a un useState() trackRemote
      if (!VideoRemote.current) return

      console.log('a;adiendo al video')
      VideoRemote.current.srcObject = ev.streams[0]
    }
  }, [])

  function initRoom() {
    PeerConnection.createOffer()
      .then(offer => {
        PeerConnection.setLocalDescription(offer).catch(err => {
          console.error(err)
        })
        socket.emit('offer', localStorage.getItem('idRoom'), offer)
      })
      .catch(err => {
        console.error(err)
      })
    setMessage('usuario conectado')
    setHiddenMessage(false)
    setTimeout(() => {
      setHiddenMessage(true)
    }, 3000)
  }

  function closeCall() {
    PeerConnection.close()
    navigate('/')
    localStorage.removeItem('idRoom')
    sessionStorage.removeItem('userLocal')
    sessionStorage.removeItem('userRemote')
  }
  return (
    <main className={css.room}>
      <Messages
        hiddenMessage={hiddenMessage}
        type={'success'}
        message={message}
      />
      <button onClick={() => console.log(PeerConnection)}>peer</button>
      <div>
        <Video
          ref={VideoLocal}
          userName={`${sessionStorage.getItem('userLocal')}`}
          typeConnection="local"
        />
        {
          /* sessionStorage.getItem('userRemote') &&  */ <Video
            ref={VideoRemote}
            userName={`${sessionStorage.getItem('userRemote')}`}
            typeConnection="remote"
          />
        }
      </div>
      {!sessionStorage.getItem('userRemote') && (
        <div className={css.messageLink}>
          <p>
            La reunion esta lista comparte el código de la sala con las personas
            que quieras que asistan.
          </p>
          <button
            onClick={() => {
              const idRoom = localStorage.getItem('idRoom')
              if (!idRoom) return
              navigator.clipboard.writeText(idRoom)
              setMessage('id de la llamada copiado')
              setHiddenMessage(false)
              setTimeout(() => {
                setHiddenMessage(true)
              }, 3000)
            }}
          >
            copiar código de sala
          </button>
        </div>
      )}
      <ControlsCall closeCall={closeCall} />
    </main>
  )
}
