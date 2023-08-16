import { io } from 'socket.io-client'

const url = import.meta.env.VITE_URL || 'http://localhost:3000'

const socket = io(url, {
  transports: ['websocket'],
})

socket.connect()

export { socket }
