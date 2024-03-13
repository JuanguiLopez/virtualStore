const { Router } = require("express");
//const ProductManager = require("../dao/fileManagers/ProductManager"); // FILE Manager
const ProductManager = require("../dao/dbManagers/ProductManager"); // MongoDB Manager

const router = Router();

//const prodManager = new ProductManager(__dirname + "/../files/ProductsJG.json"); // FILE Manager
const prodManager = new ProductManager(); // MongoDB Manager

router.get("/", async (req, res) => {
  /*
  let resultado = await prodManager.getProducts(page, limit, sort);

  const limit = req.query.limit; //Permite definir un límite de productos a mostrar

  if (limit) {
    resultado = resultado.slice(0, limit);
  }
  
  res.send({ productos: resultado });
  */
  const page = req.query.page;
  const limit = req.query.limit;
  const sort = req.query.sort;
  const query = req.query.query;
  let status = "success";

  products = await prodManager.getProducts(page, limit, sort, query);

  const pageData = {
    status: status,
    payload: products.docs,
    totalPages: products.totalPages,
    prevPage: products.prevPage,
    nextPage: products.nextPage,
    page: products.page,
    hasPrevPage: products.hasPrevPage,
    hasNextPage: products.hasNextPage,
    prevLink: products.hasPrevPage
      ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}&sort=${sort}`
      : null,
    nextLink: products.hasNextPage
      ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}&sort=${sort}`
      : null,
  };

  res.send({ resultado: "success", pageData });
});

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  const product = await prodManager.getProductById(id);

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
