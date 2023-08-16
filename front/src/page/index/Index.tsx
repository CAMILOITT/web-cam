import { useState } from 'react'
import CreateRoom from '../../components/formRoom/CreateRoom'
import JoinRoom from '../../components/formRoom/JoinRoom'
import { StatusForm } from '../../types/form/type'
import css from './Index.module.css'
import Logo from '/iconProject.svg'

interface IProps {}

export default function Index({}: IProps) {
  const [stateConnection, setStateConnection] = useState<StatusForm>('create')

  return (
    <main className={css.main}>
      <div className={css.infoWeb}>
        <img src={Logo} alt="icon web" className={css.logo} />
        <h1 className={css.nameWeb}>VideConnect</h1>
      </div>
      <div className={css.info}>
        <h1>VideoConnect</h1>
        <p>
          ¡Preparando la conexión visual! Ingresa los detalles y crea tu video
          llamada única.
        </p>
      </div>
      <div className={css.form}>
        <div className={css.switchForm}>
          <button
            className={`${css.optionRoom} ${
              stateConnection === 'create' ? css.optionRoomFocus : ''
            } `}
            onClick={() => setStateConnection('create')}
          >
            crear un llamada
          </button>
          <button
            className={`${css.optionRoom} ${
              stateConnection === 'join' ? css.optionRoomFocus : ''
            } `}
            onClick={() => setStateConnection('join')}
          >
            unirse a una llamada
          </button>
        </div>
        {stateConnection === 'create' && <CreateRoom />}
        {stateConnection === 'join' && <JoinRoom />}
      </div>
    </main>
  )
}
