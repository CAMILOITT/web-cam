import { useNavigate } from 'react-router-dom'
import { socket } from '../../api/sockets/create'
import css from './FormRoom.module.css'
import { InfoRoomContext } from '../../context/infoRoom/InfoRoom'
import { useContext } from 'react'
import { InfoRoom } from '../../types/infoRoom/interface'
interface IProps {}

export default function JoinRoom({}: IProps) {
  const navigate = useNavigate()
  const { setInfoRoom } = useContext(InfoRoomContext)
  function handleOnSubmitSecond(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { userName, idRoom } = e.currentTarget

    if (!userName.value || !idRoom.value) return

    const createRoom = {
      idRoom: idRoom.value,
      userCall: userName.value,
    }

    setInfoRoom((infoRoom: InfoRoom) => {
      return {
        ...infoRoom,
        idRoom: createRoom.idRoom,
        userLocal: createRoom.userCall,
      }
    })

    localStorage.setItem('idRoom', createRoom.idRoom)
    sessionStorage.setItem('userLocal', createRoom.userCall)

    socket.emit('joinRoom', createRoom)

    navigate('/call')
  }
  return (
    <form
      onSubmit={handleOnSubmitSecond}
      className={css.formSession}
      autoComplete="off"
    >
      <h2>Unirse a una reunion</h2>
      <label className={css.label}>
        <input
          type="text"
          name="user-name"
          id="userName"
          placeholder="nombre de usuario"
        />
      </label>
      <label className={css.label}>
        <input
          type="text"
          name="id-room"
          id="idRoom"
          placeholder="id de la reunion"
        />
      </label>
      <button className={css.btnCreate}>Unirse</button>
    </form>
  )
}
