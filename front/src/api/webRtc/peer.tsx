import { configurationConnection } from '../../const/webRtc'
import { socket } from '../sockets/create'

/**
 * @class
 * @classdesc maneja la api webRtc
 */

export default class PeerConnection {
  private peer: RTCPeerConnection
  constructor() {
    this.peer = new RTCPeerConnection(configurationConnection)
  }

  /**
   * @memberof PeerConnection
   *
   * crea una nueva instancia de la api del webRtc si el peer se encuentra en un estado cerrado
   */
  public openPeer() {
    if (this.peer.signalingState !== 'closed') return
    this.peer = new RTCPeerConnection(configurationConnection)
  }

  /**
   * @memberof PeerConnection
   *
   * cierra el peer para no recibir mas peticiones
   */

  public closePeer() {
    this.peer.close()
  }

  /**
   * @memberof PeerConnection
   *
   * crea una oferta y le agrega a su descripción local del peerA una ves agregado esta oferta se envía al otro peerB
   */

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

  /**
   * @memberof PeerConnection
   *
   * @param {RTCSessionDescriptionInit} answer es la respuesta creada por el peerB
   * agrega la respuesta del peerB a la descripción remota del peerA
   */

  public createLocalAnswer(answer: RTCSessionDescriptionInit) {
    this.peer.setRemoteDescription(answer).catch(err => {
      console.error(err)
    })
  }

  /**
   * @memberof PeerConnection
   *
   * @param offer es la oferta creada por el peerA
   * agrega la oferta del peerA a la descripción remota del peerB, luego crea una respuesta la cual añade al la descripción local del peerB
   */

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
  /**
   * @memberof PeerConnection
   *
   * @param stream es el contenido del video que se desea transmitir
   *
   * agrega el contenido del video a la conexión
   */

  public addTrack(stream: MediaStream) {
    stream.getTracks().forEach(track => {
      this.peer.addTrack(track, stream)
    })
  }

  /**
   * @memberof PeerConnection
   *
   * @param Video elemento html<Video> el cual se le va insertar la información de video de la conexión
   *
   * escucha si el peerB esta transmitiendo el video para poder agregar al elemento html<video> del peerA
   */

  public onTrack(Video: React.MutableRefObject<HTMLVideoElement | null>) {
    this.peer.ontrack = ev => {
      if (!Video.current) return
      Video.current.srcObject = ev.streams[0]
    }
  }

  /**
   * @memberof PeerConnection
   *
   * una ves tenga la descripción local y la descripción remota busca candidatos y envía la información de los candidatos al otro peer ( peerA → peerB o peerB → peerA)
   */

  public searchCandidates() {
    this.peer.onicecandidate = ev => {
      if (!ev.candidate) return
      socket.emit('sendCandidate', localStorage.getItem('idRoom'), ev.candidate)
    }
  }

  /**
   *
   * @param candidate información de los candidatos que envió el peer conectado (peerA o peerB)
   *
   * revista la información de los candidatos que envió el peer conectado (peerA o peerB) o los añade a la conexión del peerConnection(api webRtc) para permitir la transmisión de datos
   */

  public addCandidate(candidate: RTCIceCandidate) {
    if (!candidate) return
    this.peer.addIceCandidate(candidate).catch(err => {
      console.error(err)
    })
  }

  /**
   * @memberof PeerConnection
   *
   * busca errores al agregar candidatos
   */

  public searchErrorCandidate() {
    this.peer.onicecandidateerror = ev => {
      console.error(ev)
    }
  }

  /**
   *
   * @param setMessage cambia el mensaje del contenedor de mensaje
   * @param setHiddenMessage
   * @param setNameRemote nombre del usuario que se conecta
   *
   * muestra un mensaje  usuario cuando el peer remoto se desconecta
   */

  public connectionstatechange(
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setHiddenMessage: React.Dispatch<React.SetStateAction<boolean>>,
    setNameRemote: React.Dispatch<React.SetStateAction<string | null>>
  ) {
    this.peer.onconnectionstatechange = () => {
      if (this.peer.connectionState === 'disconnected') {
        setNameRemote(null)
        setMessage('usuario salio de la reunion')
        setHiddenMessage(false)
        setTimeout(() => {
          setHiddenMessage(true)
        }, 7000)
      }
    }
  }

  /**
   * obtiene una lista de objetos RTCRtpSender (se encarga de enviar una pista de medios (como audio o video) a través de la conexión) asociados a la conexión PeerConnection
   *
   * @returns una lista de objetos RTCRtpSender
   */
  public getSenders() {
    return this.peer.getSenders()
  }

  /**
   * obtiene una lista de objetos RTCRtpReceiver (se encarga de recibir una pista de medios (como audio o video) a través de la conexión) asociados a la conexión PeerConnection
   *
   * @returns una lista de objetos RTCRtpReceiver
   *
   */

  public getReceivers() {
    return this.peer.getReceivers()
  }
}
