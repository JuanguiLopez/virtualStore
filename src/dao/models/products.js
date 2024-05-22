const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  owner: {
    type: String,
    default: "adminCoder@coder.com",
  },
  thumbnails: {
    type: [String],
    default: [],
  },
});
productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
