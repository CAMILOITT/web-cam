// const express = require('express')
// const app = express()
// const http = require('http')
// const server = http.createServer(app)
// import { Request, Response } from 'express'
// import { Server } from 'socket.io'
// const io = new Server(server)

import { Server } from 'socket.io'

// app.get('/', (req: Request, res: Response) => {
//   res.send('<h1>Hello world</h1>')
// })

// const userConnect = []

const io = new Server(3000)

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

// export { server }/
