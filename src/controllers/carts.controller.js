// FILE Manager
//const CartsManager = require("../dao/fileManagers/CartsManager");
//const ProductsManager = require("../dao/fileManagers/ProductManager");
// MongoDB Manager
//const CartsManager = require("../dao/dbManagers/CartsManager");
//const ProductsManager = require("../dao/dbManagers/ProductManager");
const { cartsService, productsService } = require("../repositories");
//const CartsService = require("../services/carts.service"); // para uso de MongoDB Manager
//const ProductsService = require("../services/products.service"); // para uso de MongoDB Manager

//const cartManager = new CartsManager(__dirname + "/../files/cartsJG.json"); // FILE Manager
//const prodManager = new ProductsManager(__dirname + "/../files/ProductsJG.json"); // FILE Manager
//const prodManager = new ProductsManager(); // MongoDB Manager
//const cartManager = new CartsManager(); // MongoDB Manager
//const cartsService = new CartsService(); // para uso de MongoDB Manager
//const prodService = new ProductsService(); // para uso de MongoDB Manager

class CartsController {
  static async create(req, res) {
    //await cartManager.addCart(cart);
    const cart = await cartsService.create();

    res.send({ resultado: "success", payload: cart });
  }

  static async getById(req, res) {
    const id = req.params.cid;
    //const cart = await cartManager.getCartById(id);
    const cart = await cartsService.getById(id);

    return res.send({ cart: cart });
  }

  static async addProduct(req, res) {
    const cartId = req.params.cid;
    const prodId = req.params.pid;

    //const cart = await cartManager.getCartById(cartId);
    //const product = await prodManager.getProductById(prodId);
    const cart = await cartsService.getById(cartId);
    const product = await productsService.getById(prodId);

    try {
      if (
        req.session.user &&
        req.session.user.role == "premium" &&
        product.owner == req.session.user.email
      ) {
        throw new Error(
          `Can't add this product to cart because it belongs to you.`
        );
      }

      if (!cart) {
        return res.status(400).send({ error: "carrito no existe" });
      }

      if (!product) {
        return res.status(400).send({ error: "producto no existe" });
      }

      //await cartManager.addProduct(cartId, prodId);
      const result = await cartsService.addProduct(cartId, prodId);

      if (req.session.user) {
        req.logger.info(
          `producto agregado al carrito exitosamente por el usuario ${req.session.user.email}.`
        );
      } else {
        req.logger.info(`producto agregado al carrito exitosamente.`);
      }

      res.send({ resultado: "success", payload: result });
    } catch (error) {
      req.logger.error(error);
      return res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async updateProduct(req, res) {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const newQuantity = req.body.quantity;

    //const cart = await cartManager.getCartById(cartId);
    //const product = await prodManager.getProductById(prodId);
    const cart = await cartsService.getById(cartId);
    const product = await productsService.getById(prodId);

    if (!cart) {
      res.status(400).send({ error: "carrito no existe" });
    }

    if (!product) {
      res.status(400).send({ error: "producto no existe" });
    }

    //await cartManager.updateProduct(cartId, prodId, newQuantity);
    await cartsService.updateProduct(cartId, prodId, newQuantity);

    if (req.session.user) {
      req.logger.info(
        `producto actualizado exitosamente por el usuario ${req.session.user.email}.`
      );
    } else {
      req.logger.info(`producto actualizado exitosamente.`);
    }

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
    const product = await productsService.getById(prodId);

    if (!cart) {
      res.status(400).send({ error: "carrito no existe" });
    }

    if (!product) {
      res.status(400).send({ error: "producto no existe" });
    }

    //await cartManager.deleteProduct(cartId, prodId);
    const result = await cartsService.deleteProduct(cartId, prodId);

    if (req.session.user) {
      req.logger.info(
        `producto ${product} eliminado exitosamente por el usuario ${req.session.user.email}.`
      );
    } else {
      req.logger.info(`producto ${product} eliminado exitosamente.`);
    }

    res.send({ resultado: "success", payload: result });
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

  static async purchase(req, res) {
    const id = req.params.cid;

    try {
      const remainderProducts = await cartsService.purchase(
        id,
        req.session.user.email
      );

      if (req.session.user) {
        req.logger.info(
          `compra de productos realizada exitosamente por el usuario ${req.session.user.email}.`
        );
      } else {
        req.logger.info(`compra de productos realizada exitosamente.`);
      }

      res.send({ status: "success", payload: remainderProducts });
    } catch (error) {
      console.log(error);
      return res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }
}

module.exports = CartsController;
