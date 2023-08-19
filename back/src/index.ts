import { Server } from 'socket.io'
import 'dotenv/config'
import { PeerDescription, Room } from './types/socket/interface'

const PORT = Number(process.env.PORT) || 3000

const io = new Server(PORT)

io.on('connection', socket => {
  socket.on('createRoom', (res: Room) => {
    socket.join(res.idRoom)
  })

  socket.on('joinRoom', ({ idRoom, userCall }) => {
    socket.join(idRoom)
    socket.to(idRoom).emit('userJoin', userCall)
  })

  socket.on('offer', (room: string, offer: PeerDescription) => {
    socket.to(room).emit('offer', offer)
  })

  socket.on('answer', (room: string, ans: PeerDescription) => {
    socket.to(room).emit('answer', ans)
  })

  socket.on('sendCandidate', (room: string, candidate) => {
    socket.to(room).emit('sendCandidate', candidate)
  })

  socket.on('endCall', (room: string) => {
    socket.to(room).emit('endCall')
  })

  socket.on('infoRoom', (room: string, userCreated: string) => {
    socket.to(room).emit('infoRoom', userCreated)
  })

  socket.on('video', (room: string, video: boolean) => {
    socket.to(room).emit('video', video)
  })

  socket.on('audio', (room: string, audio: boolean) => {
    socket.to(room).emit('audio', audio)
  })
})
