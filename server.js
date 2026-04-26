const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { connectDB } = require("./db");
const { setIO, registerUser, removeUser, deliverQueuedNotifications } = require("./socketManager");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const cors = require("cors");
app.use(cors());

app.use(express.json());
const notificationRoutes = require("./api");
app.use("/api/notifications", notificationRoutes);
connectDB();
setIO(io);

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    registerUser(userId, socket.id);
    console.log(`User connected: ${userId} (socket: ${socket.id})`);
  }

  socket.on("disconnect", () => {
    removeUser(userId);
    console.log(`User disconnected: ${userId}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { io };