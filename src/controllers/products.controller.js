//const ProductManager = require("../dao/fileManagers/ProductManager"); // FILE Manager
//const ProductManager = require("../dao/dbManagers/ProductManager"); // MongoDB Manager
const { productsService } = require("../repositories/index");
//const ProductsService = require("../services/products.service"); // para uso de MongoDB Manager

//const prodManager = new ProductManager(__dirname + "/../files/ProductsJG.json"); // FILE Manager
//const prodManager = new ProductManager(); // MongoDB Manager
//const prodService = new ProductsService(); // para uso de MongoDB Manager

class ProductsController {
  static async getAll(req, res) {
    const page = req.query.page;
    const limit = req.query.limit;
    const sort = req.query.sort;
    const query = req.query.query;
    let status = "success";

    //products = await prodManager.getProducts(page, limit, sort, query);
    const products = await productsService.getAll(page, limit, sort, query);

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
  }

  static async getById(req, res) {
    const id = req.params.pid;

    //const product = await prodManager.getProductById(id);
    const product = await productsService.getById(id);

    if (!product) {
      res.send({ error: "producto no encontrado" });
    }

    res.send({ resultado: "success", payload: product });
  }

  static async create(req, res) {
    const product = req.body;
    //await prodManager.addProduct(product);
    await productsService.create(product);

    res.send({ resultado: "success", payload: product });
  }

  static async update(req, res) {
    const id = req.params.pid;
    let infoToUpdate = req.body;

    //await prodManager.updateProduct(id, infoToUpdate);
    await productsService.update(id, infoToUpdate);

    res.send({ resultado: "success", payload: infoToUpdate });
  }

  static async delete(req, res) {
    const id = req.params.pid;
    //await prodManager.deleteProduct(id);
    await productsService.delete(id);

    res.send({ resultado: "success" });
  }
}

module.exports = ProductsController;
