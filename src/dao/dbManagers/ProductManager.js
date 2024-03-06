const productModel = require("../models/products");

class ProductsManager {
  async getProducts(queryPage, queryLimit, querySort, queryQ) {
    let page = queryPage || 1;
    let limit = queryLimit || 10;
    let sort = querySort
      ? { price: querySort == "asc" ? 1 : -1 }
      : `limit: ${limit}`;

    let filter = queryQ ? JSON.parse(queryQ) : {}; // Se debe pasar, por ejemplo, de la siguiente forma: &query={"category":"Tecnología"}

    let products = await productModel.paginate(filter, {
      limit: limit,
      page: page,
      sort,
      lean: true,
    });

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

  async addProduct(product) {
    await productModel.create(product);
  }

  async getProductById(idProduct) {
    const product = await productModel.findOne({ _id: idProduct }); // alternativa para un producto

    return product;
  }

  async updateProduct(idProduct, infoToUpdate) {
    await productModel.updateOne({ _id: idProduct }, infoToUpdate);
  }

  async deleteProduct(idProduct) {
    await productModel.deleteOne({ _id: idProduct });
  }
}

module.exports = ProductsManager;
