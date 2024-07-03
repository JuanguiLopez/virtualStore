//const ProductsManager = require("../dao/dbManagers/ProductManager");

const { usersService } = require("../repositories");
const MailingService = require("./mailing.service");

const mailingService = new MailingService();

class ProductsService {
  constructor(dao) {
    this.dao = dao; //new ProductsManager();
  }

  async getAll(queryPage, queryLimit, querySort, queryQ) {
    //return await this.dao.getProducts(queryPage, queryLimit, querySort, queryQ);
    let page = queryPage || 1;
    let limit = queryLimit || 20;
    let sort = querySort
      ? { price: querySort == "asc" ? 1 : -1 }
      : `limit: ${limit}`;

    let filter = queryQ ? JSON.parse(queryQ) : {}; // Se debe pasar, por ejemplo, de la siguiente forma: &query={"category":"Tecnología"}

    let products = await this.dao.getProducts(filter, limit, page, sort);
    // let products = await productModel.paginate(filter, {
    //   limit: limit,
    //   page: page,
    //   sort,
    //   lean: true,
    // });

    products.prevLink = products.hasPrevPage
      ? `http://localhost:8080/products?page=${products.prevPage}&limit=${products.limit}` //&sort=${rest.sort}&query=${rest.query}`
      : null;
    products.nextLink = products.hasNextPage
      ? `http://localhost:8080/products?page=${products.nextPage}&limit=${products.limit}` //&sort=${rest.sort}&query=${rest.query}`
      : null;

    //let products = docs;
    // const products = await productModel.find().lean();
    return products;
  }

  async getById(id) {
    return await this.dao.getProductById(id);
  }

  async create(product) {
    return await this.dao.addProduct(product);
  }

  async update(id, product) {
    const productToUpdate = await this.dao.getProductById(id);
    if (!productToUpdate) {
      return null;
    }

    return await this.dao.updateProduct(id, product);
  }

  async delete(id) {
    const product = await this.dao.getProductById(id);

    if (!product) {
      return null;
    }

    if (product.owner && product.owner != "adminCoder@coder.com") {
      await mailingService.sendDeletedPremiumProductMail(
        product.owner,
        product.title
      );
    }

    return await this.dao.deleteProduct(id);
  }
}

module.exports = ProductsService;
