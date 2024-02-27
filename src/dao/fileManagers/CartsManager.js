const fs = require("fs");

class CartsManager {
  #id = 1;

  constructor(path) {
    this.path = path;
    //this.carts = [];
    fs.writeFileSync(path, "[]");
    this.#loadCarts();
  }

  #loadCarts() {
    try {
      let data = fs.readFileSync(this.path, "utf8");
      this.carts = JSON.parse(data);

      // Se recorren todos los productos y se asigna a la variable #id el valor siguiente al máximo existente
      this.#id =
        this.carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0) + 1;
    } catch (error) {
      console.log("Error al cargar carritos al inicio");
      this.carts = [];
    }
  }

  async #writeFile(text) {
    await fs.promises.writeFile(this.path, text);
  }

  async #readFile() {
    let data = await fs.promises.readFile(this.path, "utf8");
    return data;
  }

  async #getCarts() {
    if (!fs.existsSync(this.path)) {
      await this.#writeFile("[]");
    }

    let data = await this.#readFile();
    let carts = JSON.parse(data);

    return carts;
  }

  async addCart() {
    const content = await this.#readFile();
    const carts = JSON.parse(content);

    let cart = { id: this.#id++, products: [] };

    carts.push(cart);

    await this.#writeFile(JSON.stringify(carts, null, "\t"));
  }

  async getCartById(idCart) {
    const carts = await this.#getCarts();
    console.log("carts:", carts);
    const cart = carts.find((cart) => cart.id == idCart);
    console.log("cart:", cart);
    if (!cart) {
      console.log("Cart not found");
      return;
    }

    return cart;
  }

  async addProduct(id, productId) {
    const content = await this.#readFile();
    const carts = JSON.parse(content);

    const cartIndex = carts.findIndex((c) => c.id == id);
    let cart = carts[cartIndex];

    let productIndex = cart.products.findIndex((p) => p.product == productId);

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    carts[cartIndex] = cart;

    await this.#writeFile(JSON.stringify(carts, null, "\t"));
  }
}

module.exports = CartsManager;
