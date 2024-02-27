const cartModel = require("../models/carts");

class CartsManager {
  async addCart() {
    let cart = { products: [] };
    await cartModel.create(cart);
  }

  async getCartById(idCart) {
    const cart = await cartModel.findOne({ _id: idCart });
    return cart;
  }

  async addProduct(id, productId) {
    const cart = await this.getCartById(id);

    let productIndex = cart.products.findIndex((p) => p.product == productId);

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cartModel.updateOne({ _id: id }, cart);
  }
}

module.exports = CartsManager;
