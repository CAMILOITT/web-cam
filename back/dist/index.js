"use strict";
// import { server } from "./app"
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
// server.listen(3000, () => {
//   console.log('listening on *:3000')
// })
require("dotenv/config");
const PORT = Number(process.env.PORT) || 3000;
const io = new socket_io_1.Server(PORT);
io.on('connection', socket => {
    console.log('a user connected', socket.id);
    socket.on('createRoom', res => {
        socket.join(res.idRoom);
    });
    socket.on('joinRoom', ({ idRoom, userCall }) => {
        socket.join(idRoom);
        socket.to(idRoom).emit('userJoin', userCall);
    });
    socket.on('offer', (room, offer) => {
        socket.to(room).emit('offer', offer);
    });
    socket.on('answer', (room, ans) => {
        socket.to(room).emit('answer', ans);
    });
});
