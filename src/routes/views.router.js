const { Router } = require("express");
//const ProductManager = require("../dao/fileManagers/ProductManager"); // FILE Manager
const ProductManager = require("../dao/dbManagers/ProductManager"); // MongoDB Manager

//const prodManager = new ProductManager(__dirname + "/../files/ProductsJG.json"); // FILE Manager
const prodManager = new ProductManager(); // MongoDB Manager

const router = Router();

router.get("/", async (req, res) => {
  let products = await prodManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  let products = await prodManager.getProducts();
  res.render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

module.exports = router;
