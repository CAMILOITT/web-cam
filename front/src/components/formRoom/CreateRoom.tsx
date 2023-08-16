import { useNavigate } from 'react-router-dom'
import { socket } from '../../api/sockets/create'
import css from './FormRoom.module.css'
import { useContext } from 'react'
import { InfoRoomContext } from '../../context/infoRoom/InfoRoom'
import { InfoRoom } from '../../types/infoRoom/interface'
interface IProps {}

export default function CreateRoom({}: IProps) {
  const navigate = useNavigate()

  const { setInfoRoom } = useContext(InfoRoomContext)

  function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { userName } = e.currentTarget

    if (!userName.value) return

    const createRoom = {
      idRoom: crypto.randomUUID(),
      userCall: userName.value,
    }
    localStorage.setItem('idRoom', createRoom.idRoom)
    sessionStorage.setItem('userLocal', createRoom.userCall)

    setInfoRoom((infoRoom: InfoRoom) => {
      return {
        ...infoRoom,
        idRoom: createRoom.idRoom,
        userLocal: createRoom.userCall,
      }
    })

    socket.emit('createRoom', createRoom)

    navigate('/call')
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className={css.formSession}
      autoComplete="off"
    >
      <div>
        <h2>Crear reunion</h2>
        <p>crea una reunion para comunicarte</p>
      </div>
      <input
        type="text"
        name="user-name"
        id="userName"
        placeholder="nombre de usuario"
      />
      <button className={css.btnCreate}>Nueva Reunion</button>
    </form>
  )
}
