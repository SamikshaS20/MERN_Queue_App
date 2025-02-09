const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Queue = require("./models/Queue");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);

// ✅ Set CORS properly for Express & Socket.IO
const corsOptions = {
  origin: "https://mern-queue-app.vercel.app",  // Allow frontend
  methods: ["GET", "POST"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Handle WebSockets correctly under "/api/socket"
const io = socketIo(server, {
  cors: corsOptions
});

app.get("/", (req, res) => {
  res.send("Queue App API is running...");
});

// ✅ API route for WebSockets
app.use("/api/socket", (req, res) => {
  res.send("WebSocket server is running...");
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

let currentNumber = 0;

// ✅ Socket.IO Logic
io.on("connection", async (socket) => {
  console.log("New client connected:", socket.id);

  const queue = await Queue.find().sort({ timestamp: 1 });
  socket.emit("queueUpdate", { queue, currentNumber });

  socket.on("joinQueue", async (userData) => {
    const length = (await User.find()).length;
    const newEntry = new Queue({
      name: userData.name || `User-${Date.now()}`,
      number: length + 1,
    });

    await newEntry.save();

    await new User({
      name: newEntry.name,
      number: newEntry.number,
    }).save();

    const updatedQueue = await Queue.find().sort({ timestamp: 1 });

    io.emit("queueUpdate", { queue: updatedQueue, currentNumber });
  });

  socket.on("nextPerson", async () => {
    const nextInQueue = await Queue.findOne().sort({ timestamp: 1 });
    if (nextInQueue) {
      currentNumber = nextInQueue.number;
      await Queue.deleteOne({ _id: nextInQueue._id });

      const updatedQueue = await Queue.find().sort({ timestamp: 1 });
      io.emit("queueUpdate", { queue: updatedQueue, currentNumber });
    } else {
      io.emit("queueUpdate", { queue: [], currentNumber: 0 });
    }
  });

  socket.on("removeFromQueue", async (userId) => {
    const personToRemove = await Queue.findById(userId);
    if (personToRemove) {
      await Queue.deleteOne({ _id: userId });

      const queue = await Queue.find().sort({ timestamp: 1 });

      io.emit("queueUpdate", { queue, currentNumber });
      console.log("Successfully removed.");
    } else {
      console.log("No User to Delete.");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ✅ Change the port to use environment variable for Vercel deployment
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
