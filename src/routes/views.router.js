const { Router } = require("express");
const ProductManager = require("../ProductManager");

const prodManager = new ProductManager(__dirname + "/../files/ProductsJG.json");

const router = Router();

router.get("/", async (req, res) => {
  let products = await prodManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  let products = await prodManager.getProducts();
  res.render("realTimeProducts", { products });
});

module.exports = router;
