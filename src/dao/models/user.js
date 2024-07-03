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
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isUser: {
    type: Boolean,
    default: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
    default: [],
  },
  last_connection: {
    type: Date,
    default: null,
  },
  profile_picture: {
    type: String,
    default: "",
  },
  products: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
    default: [],
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
