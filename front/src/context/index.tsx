import { InfoRoomProvider } from './infoRoom/InfoRoom'

interface IProps {
  children: React.ReactNode
}

export default function StateProvider({ children }: IProps) {
  return <InfoRoomProvider>{children}</InfoRoomProvider>
}
