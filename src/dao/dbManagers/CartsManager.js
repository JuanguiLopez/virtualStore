const cartModel = require("../models/carts");

class CartsManager {
  async addCart(cart) {
    return await cartModel.create(cart);
  }

  async getCartById(id) {
    const cart = await cartModel.findOne({ _id: id }).lean();
    return cart;
  }

  async getCartByIdPop(id) {
    const cart = await cartModel
      .findOne({ _id: id })
      .populate("products.product")
      .lean();
    return cart;
  }

  async addProduct(id, cart) {
    await cartModel.updateOne({ _id: id }, cart);
  }

  async updateProduct(id, cart) {
    await cartModel.updateOne({ _id: id }, cart);
  }

  async updateProducts(id, cart) {
    await cartModel.updateOne({ _id: id }, cart);
  }

  async deleteProduct(id, cart) {
    await cartModel.updateOne({ _id: id }, cart);
  }

  async deleteProducts(id, cart) {
    await cartModel.updateOne({ _id: id }, cart);
  }
}

module.exports = CartsManager;
