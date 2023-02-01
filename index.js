const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom} = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    console.log(name, room);
    const { error, user } = addUser({ id: socket.id, name, room });
    if(error) return callback(error);
    socket.join(user.room);
    socket.emit('message', { user: 'system', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'system', text: `${user.name} has joined!` });
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room), color:user.colorCode});
    io.to(user.room).emit('room', { video: {url: 'https://www.youtube.com/watch?v=GTCd0hmjHBs'}});
    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', { user: user.name, text: message, color:user.colorCode });
    callback();
  });

  socket.on('typing', (typing) => {
    const user = getUser(socket.id);
    user.typing = typing;
    // socket.to(user.room).emit('typingStatus', { users: cc});
    socket.broadcast.to(user.room).emit('typingStatus', { users: getUsersInRoom(user.room) });
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('message', { user: 'system', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  });
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));