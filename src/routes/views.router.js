const { Router } = require("express");
//const ProductManager = require("../dao/fileManagers/ProductManager"); // FILE Manager
const ProductManager = require("../dao/dbManagers/ProductManager"); // MongoDB Manager
const CartsManager = require("../dao/dbManagers/CartsManager");

//const prodManager = new ProductManager(__dirname + "/../files/ProductsJG.json"); // FILE Manager
const prodManager = new ProductManager(); // MongoDB Manager
const cartManager = new CartsManager();

const router = Router();

/** middlewares */
const validatePublicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/");

  next();
};

const validatePrivateAccess = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  next();
};

/** routes */
router.get("/", validatePrivateAccess, async (req, res) => {
  const { page, limit, sort, query } = req.query;
  let products = await prodManager.getProducts(page, limit, sort, query);
  const productos = products.docs;
  //console.log(productos);

  res.render("home", { productos, user: req.session.user });
});

router.get("/realtimeproducts", validatePrivateAccess, async (req, res) => {
  const { page, limit, sort, query } = req.query;
  let products = await prodManager.getProducts(page, limit, sort, query);
  const productos = products.docs;

  res.render("realTimeProducts", { productos });
});

router.get("/products", validatePrivateAccess, async (req, res) => {
  const { page, limit, sort, query } = req.query;

  let products = await prodManager.getProducts(page, limit, sort, query);
  let { docs, ...rest } = products;

  const productos = docs;
  const prevLink = rest.prevLink;
  const nextLink = rest.nextLink;

  res.render("products", { productos, ...rest, prevLink, nextLink });
});

router.get("/carts/:cid", validatePrivateAccess, async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.getCartById(cartId);

  const products = cart.products;

  res.render("carts", { products });
});

/** chat */
router.get("/chat", validatePublicAccess, (req, res) => {
  res.render("chat", {});
});

/** register, login y reset password */
router.get("/register", validatePublicAccess, (req, res) => {
  res.render("register", {});
});

router.get("/login", validatePublicAccess, (req, res) => {
  res.render("login", {});
});

router.get("/resetPassword", validatePublicAccess, (req, res) => {
  res.render("resetPassword", {});
});

module.exports = router;
