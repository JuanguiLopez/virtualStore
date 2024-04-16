const CartsManager = require("../dao/dbManagers/CartsManager");

class CartsService {
  constructor() {
    this.dao = new CartsManager();
  }

  async create(cart) {
    return await this.dao.addCart(cart);
  }

  async getById(id) {
    return await this.dao.getCartById(id);
  }

  async addProduct(id, productId) {
    //const cart = await this.getCartById(id);
    //const cart = await cartModel.findOne({ _id: id });
    const cart = await this.dao.getCartById(id);

    let productIndex = cart.products.findIndex((p) => p.product == productId);

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this.dao.addProduct(id, cart);
  }

  async updateProduct(id, productId, newQuantity) {
    //const cart = await cartModel.findOne({ _id: id });
    const cart = await this.dao.getCartById(id);

    let productIndex = cart.products.findIndex((p) => p.product == productId);
    console.log("productIndex", productIndex);
    if (productIndex >= 0) {
      cart.products[productIndex].quantity = newQuantity;
    }
    console.log("CART", cart);

    await this.dao.updateProduct(id, cart);
  }

  async updateProducts(id, newCartProducts) {
    //const cart = await cartModel.findOne({ _id: id });
    const cart = await this.dao.getCartById(id);

    cart.products = JSON.parse(newCartProducts);

    await this.dao.updateProducts(id, cart);
  }

  async deleteProduct(id, productId) {
    //const cart = await cartModel.findOne({ _id: id });
    const cart = await this.dao.getCartById(id);

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

    await this.dao.deleteProduct(id, cart);
  }

  async deleteProducts(id) {
    //const cart = await cartModel.findOne({ _id: id });
    const cart = await this.dao.getCartById(id);

    cart.products = [];

    this.dao.deleteProducts(id, cart);
  }
}

module.exports = CartsService;
