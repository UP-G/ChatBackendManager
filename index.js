const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const authMiddleware = require('./auth.io.middleware')

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {
    origin: "http://localhost:8080",
  }});

io.use(authMiddleware)

io.on("connection", async (socket) => {

    console.log(socket.id)
    socket.on("PRIVATE_MESSAGE", ({ text, user_id, to }) => {
        const message = {
          text,
          fromUserid: user_id,
          fromSocket: socket.id,
          to,
        };
        console.log(message)
        socket.to(to).to(socket.id).emit("PRIVATE_MESSAGE", message);
    });

    socket.on("JOIN_ROOM", (roomId) => {
      console.log("JOIN: ", roomId)
        socket.join(roomId)
        console.log(socket.rooms)
    });

    socket.on("DISCONNECTION_ROOM", async (roomId) => {
      socket.leave(roomId)
      console.log(socket.rooms)
    });

    socket.on("disconnect", async () => {
      console.log("disconnect")
    });

});

const start = async () => {
    try {
      //prisma.$connect()
      httpServer.listen(3000, () => {
        console.log('Server started on port ', 3000);
      });
    } catch (e) {
      console.log(e);
    }
  };

start();
