const { Router } = require("express");
const CartsManager = require("../CartsManager");
const ProductsManager = require("../ProductManager");

const cartManager = new CartsManager(__dirname + "/../files/cartsJG.json");
const prodManager = new ProductsManager(
  __dirname + "/../files/ProductsJG.json"
);

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

module.exports = router;
