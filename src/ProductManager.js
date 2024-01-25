const fs = require("fs");

class ProductsManager {
  #id = 1;

  constructor(path) {
    this.path = path;
    this.products = [];
    this.#loadProducts();
  }

  #loadProducts() {
    try {
      let data = fs.readFileSync(this.path, "utf8");
      this.products = JSON.parse(data);

      // Se recorren todos los carritos y se asigna a la variable #id el valor siguiente al máximo existente
      this.#id =
        this.products.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        ) + 1;
    } catch (error) {
      console.log("Error al cargar productos al inicio");
      this.products = [];
    }
  }

  async #writeFile(text) {
    await fs.promises.writeFile(this.path, text);
  }

  async #readFile() {
    let data = await fs.promises.readFile(this.path, "utf8");
    return data;
  }

  async getProducts() {
    if (!fs.existsSync(this.path)) {
      await this.#writeFile("[]");
    }

    let data = await this.#readFile();
    let products = JSON.parse(data);

    return products;
  }

  async addProduct(productIn) {
    const {
      title,
      description,
      code,
      price,
      //status,
      stock,
      category,
      thumbnails,
    } = productIn;

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      //!status ||
      !stock ||
      !category ||
      !thumbnails
    ) {
      return console.log("Todos los valores son obligatorios.");
    }

    if (this.products.some((product) => product.code === code)) {
      return console.log("Existe un producto con el code ingresado.");
    }

    let product = {};
    product.id = this.#id++;
    product.title = title;
    product.description = description;
    product.code = code;
    product.price = price;
    product.status = true; //status;
    product.stock = stock;
    product.category = category;
    product.thumbnails = thumbnails;

    this.products.push(product);

    try {
      await this.#writeFile(JSON.stringify(this.products));
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }

    return this.products;
  }

  async getProductById(idProduct) {
    const products = await this.getProducts();
    const product = products.find((prod) => prod.id === idProduct);

    if (!product) {
      console.log("Not found");
      return;
    }

    return product;
  }

  async updateProduct(idproduct, infoToUpdate) {
    // Buscamos el producto a actualizar y validamos que exista.
    const productToUpdate = this.products.find((prod) => prod.id == idproduct);

    if (!productToUpdate) return `No existe el producto a actualizar`;

    // Recorremos el array de productos y actualizamos
    this.products = this.products.map((product) => {
      if (product.id == idproduct) {
        return {
          ...productToUpdate,
          title: infoToUpdate.title ?? product.title,
          description: infoToUpdate.description ?? product.description,
          code: infoToUpdate.code ?? product.code,
          price: infoToUpdate.price ?? product.price,
          status: infoToUpdate.status ?? product.status,
          stock: infoToUpdate.stock ?? product.stock,
          category: infoToUpdate.category ?? product.category,
          thumbnails: infoToUpdate.thumbnails ?? product.thumbnails,
        };
      }
      return product;
    });

    try {
      await this.#writeFile(JSON.stringify(this.products));
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  }

  async deleteProduct(idprod) {
    // Se filtran los productos dejando solo los que que no coincidan con el id ingresado
    const productsFiltered = this.products.filter((prod) => prod.id != idprod);

    // Se validan los arrays para ver si se encontró el producto con el id indicado
    if (productsFiltered.length === this.products.length)
      return `El producto con ID ${idprod} no existe`;

    // Se asignan los productos filtrados sin el producto con el id indicado
    this.products = productsFiltered;

    await this.#writeFile(JSON.stringify(this.products));

    return `Producto con ID ${idprod} eliminado correctamente`;
  }
}

module.exports = ProductsManager;
