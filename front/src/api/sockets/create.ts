import { io } from 'socket.io-client'

const url = import.meta.env.VITE_URL_SOCKETS

console.log(url);

const socket = io(url, {
  transports: ['websocket'],
})

socket.connect()

export { socket }
