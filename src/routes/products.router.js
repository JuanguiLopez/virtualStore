const { Router } = require("express");
//const ProductManager = require("../dao/fileManagers/ProductManager"); // FILE Manager
const ProductManager = require("../dao/dbManagers/ProductManager"); // MongoDB Manager

const router = Router();

//const prodManager = new ProductManager(__dirname + "/../files/ProductsJG.json"); // FILE Manager
const prodManager = new ProductManager(); // MongoDB Manager

router.get("/", async (req, res) => {
  let resultado = await prodManager.getProducts();
  const limit = req.query.limit; //Permite definir un límite de productos a mostrar

  if (limit) {
    resultado = resultado.slice(0, limit);
  }

  res.send({ productos: resultado });
});

router.get("/:pid", async (req, res) => {
  let productos = await prodManager.getProducts();
  const id = req.params.pid;
  const product = productos.find((prod) => prod.id == id);
  if (!product) {
    res.send({ error: "producto no encontrado" });
  }

  res.send({ producto: product });
});

router.post("/", async (req, res) => {
  const product = req.body;
  await prodManager.addProduct(product);

  res.send({ resultado: "success" });
});

router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  let infoToUpdate = req.body;

  await prodManager.updateProduct(id, infoToUpdate);
  res.send({ resultado: "success" });
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
  await prodManager.deleteProduct(id);

  res.send({ resultado: "success" });
});

module.exports = router;
