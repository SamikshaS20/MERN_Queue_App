const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({
  userId: String,
  position: Number,
  status: { type: String, enum: ["waiting", "served"], default: "waiting" },
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Queue", queueSchema);
