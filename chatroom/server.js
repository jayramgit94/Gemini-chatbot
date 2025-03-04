const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Handle socket connections
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for messages from client
    socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", data); // Broadcast to all users
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
