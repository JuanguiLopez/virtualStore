const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  age: Number,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  cart: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    default: "usuario",
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
