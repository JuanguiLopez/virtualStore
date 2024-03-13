const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  age: Number,
  email: String,
  password: String,
  role: String,
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
