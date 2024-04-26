class ProductsDao {
  static id = 0;
  constructor() {
    this.data = [];
  }

  async getProducts() {
    return this.data;
  }

  async addProduct(product) {
    product._id = ++BaseMemoryDAO.id;
    this.data.push(product);
    return product;
  }

  async getProductById(id) {
    return this.data.find((d) => d._id == id);
  }

  async getByProperty(property, value) {
    const result = this.data.find((d) => value == d[property]);
    return result;
  }

  async updateProduct(id, product) {
    let index = this.data.findIndex((d) => d._id == id);
    if (index < 0) {
      throw new Error("id does not exists");
    }
    this.data[index] = { ...this.data[index], ...product };
    return this.data[index];
  }

  async deleteProduct(id) {
    let index = this.data.findIndex((d) => d._id == id);
    this.data.splice(index, 1);
    return this.data;
  }
}

module.exports = ProductsDao;
