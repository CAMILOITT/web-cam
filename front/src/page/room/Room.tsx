import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../api/sockets/create'
import ControlsCall from '../../components/controlsCall/ControlsCall'
import Messages from '../../components/messages/Messages'
import { Video } from '../../components/video/Video'
import Connection from '../../api/webRtc/peer'
import css from './Room.module.css'
interface IProps {}

const constrains = {
  audio: true,
  video: true,
}

const peerConnection = new Connection()

export default function Room({}: IProps) {
  const navigate = useNavigate()
  const VideoLocal = useRef<HTMLVideoElement | null>(null)
  const VideoRemote = useRef<HTMLVideoElement | null>(null)
  const [message, setMessage] = useState('')
  const [hiddenMessage, setHiddenMessage] = useState(true)
  const [nameRemote, setNameRemote] = useState<null | string>(null)
  const [nameLocal] = useState(sessionStorage.getItem('userLocal'))
  const [videoHidden, setVideoHidden] = useState(false)
  const [audio, setAudio] = useState(false)
  const [idRoom] = useState(localStorage.getItem('idRoom'))

  useEffect(() => {
    peerConnection.openPeer()
    navigator.mediaDevices
      .getUserMedia(constrains)
      .then(stream => {
        if (!VideoLocal.current) return
        VideoLocal.current.srcObject = stream
        peerConnection.addTrack(stream)
      })
      .catch(err => {
        console.error(err)
      })

    socket.on('offer', offer => {
      peerConnection.createRemoteOfferAndAnswer(offer)
    })

    socket.on('answer', answer => {
      peerConnection.createLocalAnswer(answer)
      // código para ejecutar de nuevo el peer
      if (!peerConnection.getReceivers().length) return
      if (peerConnection.getReceivers()[1].track.muted === true && peerConnection.getReceivers()[1].track.enabled === true) {
        peerConnection.createLocalOffer()
      }
    })

    socket.on('sendCandidate', candidate => {
      peerConnection.addCandidate(candidate)
    })

    peerConnection.searchCandidates()
    peerConnection.searchErrorCandidate()

    return () => {
      socket.off('offer')
      socket.off('answer')
      socket.off('sendCandidate')
    }
  }, [])

  useEffect(() => {
    socket.on('userJoin', (userRemote: string) => {
      setNameRemote(userRemote)
      socket.emit('infoRoom', idRoom, nameLocal)
      initRoom()
    })

    socket.on('infoRoom', (userRemote: string) => {
      setNameRemote(userRemote)
    })

    socket.on('video', () => {
      setVideoHidden(prev => !prev)
    })
    socket.on('audio', () => {
      setAudio(prev => !prev)
    })

    return () => {
      socket.off('userJoin')
      socket.off('infoRoom')
      socket.off('video')
      socket.off('audio')
    }
  }, [nameLocal, idRoom])

  useEffect(() => {
    peerConnection.onTrack(VideoRemote)
  }, [])

  function initRoom() {
    peerConnection.createLocalOffer()
    setMessage('usuario conectado')
    setHiddenMessage(false)
    setTimeout(() => {
      setHiddenMessage(true)
    }, 3000)
  }

  function closeCall() {
    peerConnection.closePeer()
    navigate('/')
    localStorage.removeItem('idRoom')
    sessionStorage.removeItem('userLocal')
    sessionStorage.removeItem('userRemote')
  }

  function copyIdRoom() {
    if (!idRoom) return
    navigator.clipboard.writeText(idRoom)
    setMessage('id de la llamada copiado')
    setHiddenMessage(false)
    setTimeout(() => {
      setHiddenMessage(true)
    }, 3000)
  }

  function videoOff() {
    console.log(peerConnection.getReceivers())
    navigator.permissions
      .query({ name: 'camera' as PermissionName })
      .then(({ state }) => {
        state === 'granted' && socket.emit('video', idRoom, !videoHidden)
      })
  }

  function microphoneOff() {
    navigator.permissions
      .query({ name: 'microphone' as PermissionName })
      .then(({ state }) => {
        state === 'granted' && socket.emit('audio', idRoom, !audio)
      })
  }

  function audioOff() {
    if (!VideoRemote.current) return
    const { muted } = VideoRemote.current
    muted === false
      ? (VideoRemote.current.muted = true)
      : (VideoRemote.current.muted = false)
  }

  return (
    <main className={css.room}>
      <Messages
        hiddenMessage={hiddenMessage}
        type={'success'}
        message={message}
      />
      <div>
        <Video
          ref={VideoLocal}
          userName={`${nameLocal}`}
          typeConnection="local"
          listAttributes={{ muted: true, autoPlay: true }}
        />
        {nameRemote && (
          <Video
            ref={VideoRemote}
            userName={`${nameRemote}`}
            typeConnection="remote"
            listAttributes={{ autoPlay: true, muted: audio }}
            hiddenVideo={videoHidden}
          />
        )}
      </div>
      {!nameRemote && (
        <div className={css.messageLink}>
          <p>
            La reunion esta lista comparte el código de la sala con las personas
            que quieras que asistan.
          </p>
          <button onClick={copyIdRoom}>copiar código de sala</button>
        </div>
      )}
      <ControlsCall
        closeCall={closeCall}
        videoOff={videoOff}
        audioOff={audioOff}
        microphoneOff={microphoneOff}
      />
    </main>
  )
}
