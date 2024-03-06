const { Router } = require("express");
// FILE Manager
//const CartsManager = require("../dao/fileManagers/CartsManager");
//const ProductsManager = require("../dao/fileManagers/ProductManager");
// MongoDB Manager
const CartsManager = require("../dao/dbManagers/CartsManager");
const ProductsManager = require("../dao/dbManagers/ProductManager");

//const cartManager = new CartsManager(__dirname + "/../files/cartsJG.json"); // FILE Manager
//const prodManager = new ProductsManager(__dirname + "/../files/ProductsJG.json"); // FILE Manager
const prodManager = new ProductsManager(); // MongoDB Manager
const cartManager = new CartsManager(); // MongoDB Manager

const router = Router();

router.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  const cart = await cartManager.getCartById(id);

  res.send({ cart: cart });
});

router.post("/", async (req, res) => {
  await cartManager.addCart();

  res.send({ resultado: "success" });
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const prodId = req.params.pid;

  const cart = await cartManager.getCartById(cartId);
  const product = await prodManager.getProductById(prodId);

  if (!cart) {
    res.status(400).send({ error: "carrito no existe" });
  }

  if (!product) {
    res.status(400).send({ error: "producto no existe" });
  }

  await cartManager.addProduct(cartId, prodId);

  res.send({ resultado: "success" });
});

router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const prodId = req.params.pid;
  const newQuantity = req.body.quantity;

  const cart = await cartManager.getCartById(cartId);
  const product = await prodManager.getProductById(prodId);

  if (!cart) {
    res.status(400).send({ error: "carrito no existe" });
  }

  if (!product) {
    res.status(400).send({ error: "producto no existe" });
  }

  await cartManager.updateProduct(cartId, prodId, newQuantity);

  res.send({ resultado: "success" });
});

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const newCartProducts = req.body.products;

  const cart = await cartManager.getCartById(cartId);

  if (!cart) {
    res.status(400).send({ error: "carrito no existe" });
  }

  await cartManager.updateProducts(cartId, JSON.stringify(newCartProducts));

  res.send({ resultado: "success" });
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const prodId = req.params.pid;

  const cart = await cartManager.getCartById(cartId);
  const product = await prodManager.getProductById(prodId);

  if (!cart) {
    res.status(400).send({ error: "carrito no existe" });
  }

  if (!product) {
    res.status(400).send({ error: "producto no existe" });
  }

  await cartManager.deleteProduct(cartId, prodId);

  res.send({ resultado: "success" });
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  const cart = await cartManager.getCartById(cartId);

  if (!cart) {
    res.status(400).send({ error: "Carrito no existe" });
  }

  await cartManager.deleteProducts(cartId);

  res.send({ resultado: "success" });
});

module.exports = router;
