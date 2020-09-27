const users = [];
const colors = ["3e978b", "ff7e67","ff4b5c","ff9a76","709fb0","84142d","cf7500","206a5d","c70039","63b7af"];
const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  
  const typing = false;
  const colorCode = colors[Math.floor(Math.random()*10)];

  const existingUser = users.find((user) => user.room === room && user.name === name);

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, name, room, colorCode, typing };
  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };