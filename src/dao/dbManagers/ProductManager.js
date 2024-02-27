const productModel = require("../models/products");

class ProductsManager {
  async getProducts() {
    const products = await productModel.find().lean();
    return products;
  }

  async addProduct(product) {
    await productModel.create(product);
  }

  async getProductById(idProduct) {
    const products = await productModel.find({ _id: idProduct }).lean();
    //const product = await productModel.findOne({_id: idProduct}); // alternativa para un producto

    return products[0];
  }

  async updateProduct(idProduct, infoToUpdate) {
    await productModel.updateOne({ _id: idProduct }, infoToUpdate);
  }

  async deleteProduct(idProduct) {
    await productModel.deleteOne({ _id: idProduct });
  }
}

module.exports = ProductsManager;
