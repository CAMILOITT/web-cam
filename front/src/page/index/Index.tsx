interface IProps {}

import { useNavigate } from 'react-router-dom'
import { socket } from '../../api/sockets/create'

export default function Index({}: IProps) {
  const navigate = useNavigate()
  function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { userName } = e.currentTarget

    const createRoom = {
      idRoom: crypto.randomUUID(),
      userCall: userName.value,
    }
    localStorage.setItem('idRoom', createRoom.idRoom)

    console.log(createRoom)

    socket.emit('createRoom', createRoom)

    navigate('/call')
  }

  function handleOnSubmitSecond(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { userName, idRoom } = e.currentTarget

    const createRoom = {
      idRoom: idRoom.value,
      userCall: userName.value,
    }
    localStorage.setItem('idRoom', createRoom.idRoom)

    console.log(createRoom)

    socket.emit('joinRoom', createRoom)

    navigate('/call')
  }

  return (
    <main>
      <h1>hacer una llamada</h1>

      <div>
        <button>crear un llamada</button>
        <button>unirse a una llamada</button>
        <form onSubmit={handleOnSubmit}>
          <h2>Crear una llamada</h2>
          <label>
            nombre de usuario
            <input type="text" name="user-name" id="userName" />
          </label>
          <button>crear</button>
        </form>

        <form onSubmit={handleOnSubmitSecond}>
          <h2>Unirse a una llamada</h2>
          <label>
            nombre de usuario
            <input type="text" name="user-name" id="userName" />
          </label>
          <label>
            id de la reunion
            <input type="text" name="id-room" id="idRoom" />
          </label>
          <button>unirse</button>
        </form>
      </div>
    </main>
  )
}
