import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    // Example: emit alert to frontend
    socket.on("new-alert", (data) => {
      console.log("📢 New alert:", data);
      io.emit("alert-update", data); // broadcast
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
