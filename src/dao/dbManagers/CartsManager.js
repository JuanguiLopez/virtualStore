const cartModel = require("../models/carts");
const productModel = require("../models/products");

class CartsManager {
  async addCart() {
    let cart = { products: [] };
    await cartModel.create(cart);
  }

  async getCartById(idCart) {
    const cart = await cartModel
      .findOne({ _id: idCart })
      .populate("products.product")
      .lean();
    return cart;
  }

  async addProduct(id, productId) {
    //const cart = await this.getCartById(id);
    const cart = await cartModel.findOne({ _id: id });

    let productIndex = cart.products.findIndex((p) => p.product == productId);

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cartModel.updateOne({ _id: id }, cart);
  }

  async updateProduct(id, productId, newQuantity) {
    const cart = await cartModel.findOne({ _id: id });

    let productIndex = cart.products.findIndex((p) => p.product == productId);

    if (productIndex >= 0) {
      cart.products[productIndex].quantity = newQuantity;
    }

    await cartModel.updateOne({ _id: id }, cart);
  }

  async updateProducts(id, newCartProducts) {
    const cart = await cartModel.findOne({ _id: id });

    cart.products = JSON.parse(newCartProducts);

    await cartModel.updateOne({ _id: id }, cart);
  }

  async deleteProduct(id, productId) {
    const cart = await cartModel.findOne({ _id: id });

    let productIndex = cart.products.findIndex((p) => p.product == productId);

    if (productIndex >= 0) {
      if (cart.products[productIndex].quantity == 1) {
        const productsFiltered = cart.products.filter(
          (prod) => prod.id != productId
        );
        cart.products[productIndex] = productsFiltered;
      } else {
        cart.products[productIndex].quantity -= 1;
      }
    }

    await cartModel.updateOne({ _id: id }, cart);
  }

  async deleteProducts(id) {
    const cart = await cartModel.findOne({ _id: id });

    cart.products = [];

    await cartModel.updateOne({ _id: id }, cart);
  }
}

module.exports = CartsManager;
