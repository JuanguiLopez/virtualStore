//const ProductManager = require("../dao/fileManagers/ProductManager"); // FILE Manager
//const ProductManager = require("../dao/dbManagers/ProductManager"); // MongoDB Manager
const { productsService } = require("../repositories/index");
const CustomError = require("../utils/errorHandling/CustomError");
const ErrorTypes = require("../utils/errorHandling/ErrorTypes");
const { getProductErrorInfo } = require("../utils/errorHandling/errorInfo");
const { generateProduct } = require("../utils/utils");
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

    req.logger.debug(`productos cargados correctamente!`);
    res.send({ resultado: "success", pageData });
  }

  static async generateProducts(req, res) {
    const quantity = req.query.quantity || 100;
    const products = [];

    for (let i = 0; i < quantity; i++) {
      products.push(generateProduct());
    }

    req.logger.info(`solicitud de productos mockeados exitosa.`);
    res.send({ resultado: "success", payload: products });
  }

  static async getById(req, res) {
    const id = req.params.pid;

    //const product = await prodManager.getProductById(id);
    const product = await productsService.getById(id);

    if (!product) {
      res.send({ error: "producto no encontrado" });
    }

    req.logger.debug(`producto ${product} obtenido correctamente!`);
    res.send({ resultado: "success", payload: product });
  }

  static async create(req, res, next) {
    try {
      const { title, description, code, stock, price, category } = req.body;

      if (!title || !description || !code || !stock || !price || !category) {
        throw new CustomError({
          name: "Product creation error",
          cause: getProductErrorInfo({
            title,
            description,
            code,
            stock,
            price,
            category,
          }),
          message: "Error creating a product",
          code: ErrorTypes.INVALID_TYPE_ERROR,
        });
      }

      if (req.session.user && req.session.user.role == "premium") {
        req.body.owner = req.session.user.email;
      }

      //const product = {title, description, code, price, stock, category};

      //await productsService.create(product);
      await productsService.create(req.body);
      const products = await productsService.getAll();
      //const product = req.body;
      //console.log("product ---->", product);
      //await productsService.create(product);

      req.logger.info(`producto creado correctamente.`);
      res.send({ resultado: "success", payload: products });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const id = req.params.pid;
      let infoToUpdate = req.body;

      //await prodManager.updateProduct(id, infoToUpdate);
      await productsService.update(id, infoToUpdate);

      res.send({ resultado: "success", payload: infoToUpdate });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const id = req.params.pid;
    const user = req.session.user;

    try {
      const product = await productsService.getById(id);

      if (
        user &&
        user.role == "premium" &&
        product.owner &&
        product.owner != user.email
      ) {
        throw new Error(
          `Can't delete this product because it don't belong to you.`
        );
      }

      //await prodManager.deleteProduct(id);
      const result = await productsService.delete(id);

      req.logger.info(`producto eliminado correctamente.`);
      res.send({ resultado: "success", payload: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductsController;
