import { createContext } from 'react'

export const InfoCallContext = createContext({})

interface IProps {
  children: React.ReactNode
}

export function InfoCallProvider({ children }: IProps) {
  const data = {}
  return (
    <InfoCallContext.Provider value={data}>{children}</InfoCallContext.Provider>
  )
}
