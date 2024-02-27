const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: {
    type: [String],
    default: [],
  },
});

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
