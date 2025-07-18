import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", async (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    // Mark user as online in DB
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
    } catch (err) {
      console.error("Error setting user online:", err);
    }
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", async () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    // Mark user as offline in DB
    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, { isOnline: false });
      } catch (err) {
        console.error("Error setting user offline:", err);
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
