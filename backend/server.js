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

// ✅ Set CORS properly for both Express and Socket.IO
const corsOptions = {
  origin: "https://mern-queue-app.vercel.app",  // Allow your frontend domain
  methods: ["GET", "POST"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const io = socketIo(server, {
  cors: corsOptions
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

let currentNumber = 0;

// Socket.IO Logic
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

    // Store user in User model for data storage
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

  // Remove a person from the queue
  socket.on("removeFromQueue", async (userId) => {
    const personToRemove = await Queue.findById(userId);
    if (personToRemove) {
      await Queue.deleteOne({ _id: userId });

      // Adjust queue numbers
      const queue = await Queue.find().sort({ timestamp: 1 });
      // for (let i = 0; i < queue.length; i++) {
      //   queue[i].number = i + 1;
      //   await queue[i].save();
      // }

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

server.listen(5000, () => console.log("Server running on port 5000"));
