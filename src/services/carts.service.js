//const CartsManager = require("../dao/dbManagers/CartsManager");

const MailingService = require("./mailing.service");

const mailingService = new MailingService();

class CartsService {
  constructor(dao, productsService, ticketService) {
    this.dao = dao; //new CartsManager();
    this.productsService = productsService;
    this.ticketService = ticketService;
  }

  async create() {
    const cart = { products: [] };
    return await this.dao.addCart(cart);
  }

  async getById(id) {
    return await this.dao.getCartById(id);
  }

  async getByIdPop(id) {
    return await this.dao.getCartByIdPop(id);
  }

  async addProduct(id, productId) {
    //const cart = await this.getCartById(id);
    //const cart = await cartModel.findOne({ _id: id });
    const cart = await this.getById(id);

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
    const cart = await this.getById(id);

    let productIndex = cart.products.findIndex((p) => p.product == productId);

    if (productIndex >= 0) {
      cart.products[productIndex].quantity = newQuantity;
    }

    await this.dao.updateProduct(id, cart);
  }

  async updateProducts(id, newCartProducts) {
    //const cart = await cartModel.findOne({ _id: id });
    const cart = await this.getById(id);

    cart.products = JSON.parse(newCartProducts);

    await this.dao.updateProducts(id, cart);
  }

  async deleteProduct(id, productId) {
    //const cart = await cartModel.findOne({ _id: id });
    const cart = await this.getById(id);

    let productIndex = cart.products.findIndex((p) => p.product == productId);

    if (productIndex >= 0) {
      if (cart.products[productIndex].quantity == 1) {
        const productsFiltered = cart.products.filter(
          (prod) => prod.product != productId
        );

        cart.products = productsFiltered;
      } else {
        cart.products[productIndex].quantity -= 1;
      }
    }

    await this.dao.deleteProduct(id, cart);
  }

  async deleteProducts(id) {
    //const cart = await cartModel.findOne({ _id: id });
    const cart = await this.getById(id);

    cart.products = [];

    this.dao.deleteProducts(id, cart);
  }

  async purchase(cartId, userEmail) {
    const cart = await this.getByIdPop(cartId);

    const notPurchasedIds = [];
    let totalAmount = 0;
    //for (const product of cart.products) {
    for (let i = 0; i < cart.products.length; i++) {
      const product = cart.products[i];
      const remainder = product.product.stock - product.quantity;

      if (remainder >= 0) {
        await this.productsService.update(product.product._id, {
          ...product.item,
          stock: remainder,
        });

        for (let i = 0; i < product.quantity; i++) {
          await this.deleteProduct(cartId, product.product._id.toString());
          totalAmount += product.product.price;
        }
        //await this.deleteProduct(cartId, product.product._id.toString());
        //totalAmount += product.quantity * product.product.price;
      } else {
        notPurchasedIds.push(product.product._id);
      }
    }

    if (totalAmount > 0) {
      const ticket = await this.ticketService.generate(userEmail, totalAmount);
      await mailingService.sendPurchaseMail(userEmail, ticket.code);
    }

    return notPurchasedIds;
  }
}

module.exports = CartsService;
