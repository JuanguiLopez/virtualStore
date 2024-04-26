//const ProductManager = require("../dao/fileManagers/ProductManager"); // FILE Manager
//const ProductManager = require("../dao/dbManagers/ProductManager"); // MongoDB Manager
//const CartsManager = require("../dao/dbManagers/CartsManager");
//const ProductsService = require("../services/products.service");
const { cartsService, productsService } = require("../repositories");

//const prodManager = new ProductManager(__dirname + "/../files/ProductsJG.json"); // FILE Manager
//const prodManager = new ProductManager(); // MongoDB Manager
//const prodService = new ProductsService(); // para uso de MongoDB Manager
//const cartManager = new CartsManager();

class viewsController {
  static async getHome(req, res) {
    const { page, limit, sort, query } = req.query;
    //let products = await prodManager.getProducts(page, limit, sort, query);
    let products = await productsService.getAll(page, limit, sort, query);
    const productos = products.docs;
    //console.log("PROD", productos);

    res.render("home", { productos, user: req.session.user });
  }

  static async getRealTimeItems(req, res) {
    const { page, limit, sort, query } = req.query;
    //let products = await prodManager.getProducts(page, limit, sort, query);
    let products = await productsService.getAll(page, limit, sort, query);
    const productos = products.docs;

    res.render("realTimeProducts", { productos });
  }

  static async getProducts(req, res) {
    const { page, limit, sort, query } = req.query;

    //let products = await prodManager.getProducts(page, limit, sort, query);
    let products = await productsService.getAll(page, limit, sort, query);
    let { docs, ...rest } = products;

    const productos = docs;
    const prevLink = rest.prevLink;
    const nextLink = rest.nextLink;

    const cart = await cartsService.getByIdPop(req.session.user.cart);

    res.render("products", {
      productos,
      ...rest,
      prevLink,
      nextLink,
      user: req.session.user,
      cart,
    });
  }

  static async getCart(req, res) {
    const cartId = req.params.cid;
    const cart = await cartsService.getByIdPop(cartId);

    const products = cart.products;

    res.render("carts", { products });
  }

  static getChat(req, res) {
    res.render("chat", { user: req.session.user });
  }

  static getRegister(req, res) {
    res.render("register", {});
  }

  static getLogin(req, res) {
    res.render("login", {});
  }

  static getResetPassword(req, res) {
    res.render("resetPassword", {});
  }
}

module.exports = viewsController;
