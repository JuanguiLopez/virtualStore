const productModel = require("../models/products");

class ProductsManager {
  async getProducts(filter, limit, page, sort) {
    return await productModel.paginate(filter, {
      limit,
      page,
      sort,
      lean: true,
    });
  }

  async addProduct(product) {
    return await productModel.create(product);
  }

  async getProductById(idProduct) {
    const product = await productModel.findOne({ _id: idProduct }); // alternativa para un producto

    return product;
  }

  async updateProduct(idProduct, infoToUpdate) {
    return await productModel.updateOne({ _id: idProduct }, infoToUpdate);
  }

  async deleteProduct(idProduct) {
    return await productModel.deleteOne({ _id: idProduct });
  }
}

module.exports = ProductsManager;
