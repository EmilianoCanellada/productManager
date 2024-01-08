const fs = require('fs');
const { promisify } = require('util');

class ProductManager {
  constructor(productsFilePath) {
    this.productsPath = productsFilePath;
    this.products = this.loadProducts();
  }

  async loadProducts() {
    try {
      if (fs.existsSync(this.productsPath)) {
        const readFile = promisify(fs.readFile);
        const data = await readFile(this.productsPath, 'utf-8');
        return JSON.parse(data);
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error al cargar productos: ${error.message}`);
      return [];
    }
  }

  async saveProducts() {
    try {
      const writeFile = promisify(fs.writeFile);
      await writeFile(this.productsPath, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error(`Error al guardar productos: ${error.message}`);
    }
  }

  // Métodos para gestionar productos
  async addProduct(product) {
    const existingProduct = this.products.find((p) => p.code === product.code);

    if (existingProduct) {
      console.log("Ya existe un producto con el mismo código. No se agregará duplicado.");
      return existingProduct; // Devuelve el producto existente si ya existe
    }

    //No devuelve mas un mensaje Error.,
    const newProduct = {
      id: this.generateProductID(),
      ...product,
    };

    this.products.push(newProduct);
    await this.saveProducts();

    return newProduct;
  }

  async getProducts() {
    return this.products;
  }

  async getProductById(id) {
    try {
      const products = await this.loadProducts();
      const product = products.find((p) => p.id === id);
      if (!product) {
        throw new Error('Producto no encontrado.');
      }
      return product;
    } catch (error) {
      throw new Error(`Error al obtener producto por ID: ${error.message}`);
    }
  }

  //Nuevos metodos
  async updateProduct(id, updatedProduct) {
    const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      throw new Error("Producto no encontrado.");
    }

    this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct };
    await this.saveProducts();
    return this.products[productIndex];
  }

  async deleteProduct(id) {
    const updatedProducts = this.products.filter((product) => product.id !== id);

    if (this.products.length === updatedProducts.length) {
      throw new Error("Producto no encontrado.");
    }

    this.products = updatedProducts;
    await this.saveProducts();
  }

  generateProductID() {
    if (this.products.length === 0) {
      return 1;
    }

    const ids = this.products.map((product) => product.id);
    const maxID = Math.max(...ids);
    return maxID + 1;
  }
}

module.exports = ProductManager;
