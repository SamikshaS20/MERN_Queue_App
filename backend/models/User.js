const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  number: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
