const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
});

const messageModel = mongoose.model("messages", messageSchema);

module.exports = messageModel;
