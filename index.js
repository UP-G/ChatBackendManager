const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const authMiddleware = require('./middleware/auth.io.middleware')
const client = require('../Backend/clientDb')

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {
    origin: "http://localhost:8080",
  }});

io.use(authMiddleware)

io.on("connection", async (socket) => {

    //console.log(socket.rooms)
    socket.on("PRIVATE_MESSAGE", async ({ content, creator_message_id, chat_room_id }) => {
        const message = {
          chat_room_id,
          creator_message_id,
          content,
          date_of_creation: new Date(),
        };
        console.log(message)
        await client.message.create({
          data: {
            ...message
          }
        })
        console.log(message)
        socket.to(chat_room_id).to(socket.id).emit("PRIVATE_MESSAGE", message);
    });

    socket.on("JOIN_ROOM", async (roomId) => {
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
