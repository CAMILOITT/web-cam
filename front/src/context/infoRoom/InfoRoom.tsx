import { createContext, useState } from 'react'
import { context, initInfoRoom } from './context'

export const InfoRoomContext = createContext(context)

interface IProps {
  children: React.ReactNode
}

export function InfoRoomProvider({ children }: IProps) {
  const [infoRoom, setInfoRoom] = useState(initInfoRoom)
  const data = { infoRoom, setInfoRoom }
  return (
    <InfoRoomContext.Provider value={data}>{children}</InfoRoomContext.Provider>
  )
}
