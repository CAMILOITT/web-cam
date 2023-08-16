export interface InfoRoom {
  idRoom: string
  userLocal: string
  userRemote: string
}

export interface InfoRoomContext {
  infoRoom: InfoRoom
  setInfoRoom: React.Dispatch<React.SetStateAction<InfoRoom>>
}