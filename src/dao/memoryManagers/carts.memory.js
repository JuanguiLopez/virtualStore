class CartsDao {
  static id = 0;
  constructor() {
    this.data = [];
  }

  async getAll() {
    return this.data;
  }

  async addCart(item) {
    item._id = ++BaseMemoryDAO.id;
    this.data.push(item);
    return item;
  }

  async getCartById(id) {
    return this.data.find((d) => d._id == id);
  }

  async getByProperty(property, value) {
    const result = this.data.find((d) => value == d[property]);
    return result;
  }

  async updateProduct(id, cart) {
    let index = this.data.findIndex((d) => d._id == id);
    if (index < 0) {
      throw new Error("cart does not exists");
    }
    this.data[index] = { ...this.data[index], ...cart };
    return this.data[index];
  }

  async updateProducts(id, cart) {
    let index = this.data.findIndex((d) => d._id == id);
    if (index < 0) {
      throw new Error("cart does not exists");
    }
    this.data[index] = cart;
    return this.data[index];
  }

  async deleteProduct(id, cart) {
    let index = this.data.findIndex((d) => d._id == id);
    if (index < 0) {
      throw new Error("cart does not exists");
    }
    this.data[index] = { ...this.data[index], ...cart };
    return this.data[index];
  }

  async deleteProducts(id, cart) {
    let index = this.data.findIndex((d) => d._id == id);
    if (index < 0) {
      throw new Error("cart does not exists");
    }
    this.data[index] = cart;
    return this.data[index];
  }

  async update(id, item) {
    let index = this.data.findIndex((d) => d._id == id);
    if (index < 0) {
      throw new Error("cart does not exists");
    }
    this.data[index] = { ...this.data[index], ...item };
    return this.data[index];
  }

  async delete(id) {
    let index = this.data.findIndex((d) => d._id == id);
    if (index < 0) {
      throw new Error("cart does not exists");
    }
    this.data.splice(index, 1);
    return this.data;
  }
}

module.exports = CartsDao;
