const { Router } = require("express");
//const ProductManager = require("../dao/fileManagers/ProductManager"); // FILE Manager
const ProductManager = require("../dao/dbManagers/ProductManager"); // MongoDB Manager
const CartsManager = require("../dao/dbManagers/CartsManager");

//const prodManager = new ProductManager(__dirname + "/../files/ProductsJG.json"); // FILE Manager
const prodManager = new ProductManager(); // MongoDB Manager
const cartManager = new CartsManager();

const router = Router();

router.get("/", async (req, res) => {
  const { page, limit, sort, query } = req.query;
  let products = await prodManager.getProducts(page, limit, sort, query);
  const productos = products.docs;
  console.log(productos);

  res.render("home", { productos });
});

router.get("/realtimeproducts", async (req, res) => {
  const { page, limit, sort, query } = req.query;
  let products = await prodManager.getProducts(page, limit, sort, query);
  const productos = products.docs;

  res.render("realTimeProducts", { productos });
});

router.get("/products", async (req, res) => {
  const { page, limit, sort, query } = req.query;

  let products = await prodManager.getProducts(page, limit, sort, query);
  let { docs, ...rest } = products;

  const productos = docs;
  const prevLink = rest.prevLink;
  const nextLink = rest.nextLink;

  res.render("products", { productos, ...rest, prevLink, nextLink });
});

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.getCartById(cartId);

  const products = cart.products;

  res.render("carts", { products });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

module.exports = router;
