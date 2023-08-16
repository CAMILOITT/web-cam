export interface Room {
  idRoom: string
}

export interface UserJoiner {
  userJoiner: string
}

export interface PeerDescription {
  type: 'offer' | 'answer'
  sdp: string
}