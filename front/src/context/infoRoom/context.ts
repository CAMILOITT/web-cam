import { InfoRoom, InfoRoomContext } from '../../types/infoRoom/interface'

export const initInfoRoom: InfoRoom = {
  idRoom: '',
  userLocal: '',
  userRemote: '',
}

export const context: InfoRoomContext = {
  infoRoom: initInfoRoom,
  setInfoRoom: infoRoom => {
    infoRoom
  },
}
