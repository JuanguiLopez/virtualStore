// FILE Manager
//const CartsManager = require("../dao/fileManagers/CartsManager");
//const ProductsManager = require("../dao/fileManagers/ProductManager");
// MongoDB Manager
//const CartsManager = require("../dao/dbManagers/CartsManager");
//const ProductsManager = require("../dao/dbManagers/ProductManager");
const CartsService = require("../services/carts.service"); // para uso de MongoDB Manager
const ProductsService = require("../services/products.service"); // para uso de MongoDB Manager

//const cartManager = new CartsManager(__dirname + "/../files/cartsJG.json"); // FILE Manager
//const prodManager = new ProductsManager(__dirname + "/../files/ProductsJG.json"); // FILE Manager
//const prodManager = new ProductsManager(); // MongoDB Manager
//const cartManager = new CartsManager(); // MongoDB Manager
const cartsService = new CartsService(); // para uso de MongoDB Manager
const prodService = new ProductsService(); // para uso de MongoDB Manager

class CartsController {
  static async create(req, res) {
    let cart = { products: [] };
    //await cartManager.addCart(cart);
    await cartsService.create(cart);

    res.send({ resultado: "success" });
  }

  static async getById(req, res) {
    const id = req.params.cid;
    //const cart = await cartManager.getCartById(id);
    const cart = await cartsService.getById(id);

    res.send({ cart: cart });
  }

  static async addProduct(req, res) {
    const cartId = req.params.cid;
    const prodId = req.params.pid;

    //const cart = await cartManager.getCartById(cartId);
    //const product = await prodManager.getProductById(prodId);
    const cart = await cartsService.getById(cartId);
    const product = await prodService.getById(prodId);

    if (!cart) {
      res.status(400).send({ error: "carrito no existe" });
    }

    if (!product) {
      res.status(400).send({ error: "producto no existe" });
    }

    //await cartManager.addProduct(cartId, prodId);
    await cartsService.addProduct(cartId, prodId);

    res.send({ resultado: "success" });
  }

  static async updateProduct(req, res) {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const newQuantity = req.body.quantity;

    //const cart = await cartManager.getCartById(cartId);
    //const product = await prodManager.getProductById(prodId);
    const cart = await cartsService.getById(cartId);
    const product = await prodService.getById(prodId);

    if (!cart) {
      res.status(400).send({ error: "carrito no existe" });
    }

    if (!product) {
      res.status(400).send({ error: "producto no existe" });
    }

    //await cartManager.updateProduct(cartId, prodId, newQuantity);
    await cartsService.updateProduct(cartId, prodId, newQuantity);

    res.send({ resultado: "success" });
  }

  static async updateProducts(req, res) {
    const cartId = req.params.cid;
    const newCartProducts = req.body.products;

    //const cart = await cartManager.getCartById(cartId);
    const cart = await cartsService.getById(cartId);

    if (!cart) {
      res.status(400).send({ error: "carrito no existe" });
    }

    //await cartManager.updateProducts(cartId, JSON.stringify(newCartProducts));
    await cartsService.updateProducts(cartId, JSON.stringify(newCartProducts));

    res.send({ resultado: "success" });
  }

  static async deleteProduct(req, res) {
    const cartId = req.params.cid;
    const prodId = req.params.pid;

    //const cart = await cartManager.getCartById(cartId);
    //const product = await prodManager.getProductById(prodId);
    const cart = await cartsService.getById(cartId);
    const product = await prodService.getById(prodId);

    if (!cart) {
      res.status(400).send({ error: "carrito no existe" });
    }

    if (!product) {
      res.status(400).send({ error: "producto no existe" });
    }

    //await cartManager.deleteProduct(cartId, prodId);
    await cartsService.deleteProduct(cartId, prodId);

    res.send({ resultado: "success" });
  }

  static async deleteProducts(req, res) {
    const cartId = req.params.cid;

    //const cart = await cartManager.getCartById(cartId);
    const cart = await cartsService.getById(cartId);

    if (!cart) {
      res.status(400).send({ error: "Carrito no existe" });
    }

    //await cartManager.deleteProducts(cartId);
    await cartsService.deleteProducts(cartId);

    res.send({ resultado: "success" });
  }
}

module.exports = CartsController;
