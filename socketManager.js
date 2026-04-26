const onlineUsers = new Map();
let ioInstance = null;

const setIO = (io) => {
  ioInstance = io;
};

const registerUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

const removeUser = (userId) => {
  onlineUsers.delete(userId);
};

const isUserOnline = (userId) => onlineUsers.has(userId);

const sendToUser = (userId, notification) => {
  const socketId = onlineUsers.get(userId);
  if (socketId && ioInstance) {
    ioInstance.to(socketId).emit("notification", notification);
    return true;
  }
  return false;
};

module.exports = { setIO, registerUser, removeUser, isUserOnline, sendToUser };