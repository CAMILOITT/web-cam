// import { server } from "./app"

import { Server } from 'socket.io'

// server.listen(3000, () => {
//   console.log('listening on *:3000')
// })

import 'dotenv/config'

const PORT = Number(process.env.PORT)||3000

const io = new Server(PORT)

io.on('connection', socket => {
  console.log('a user connected', socket.id)

  socket.on('createRoom', res => {
    socket.join(res.idRoom)
  })

  socket.on('joinRoom', ({ idRoom, userCall }) => {
    socket.join(idRoom)
    socket.to(idRoom).emit('userJoin', userCall)
  })

  socket.on('offer', (room, offer) => {
    socket.to(room).emit('offer', offer)
  })

  socket.on('answer', (room, ans) => {
    socket.to(room).emit('answer', ans)
  })
})
