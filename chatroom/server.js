const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path"); // Import path module
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, "public")));

// Handle root request by serving `index.html`
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Setup WebSocket server
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
