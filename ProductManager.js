const fs = require("fs");

class ProductManager {
  constructor(productsFilePath) {
    this.productsPath = productsFilePath;
    this.products = this.loadProducts();
  }

  loadProducts() {
    try {
      if (fs.existsSync(this.productsPath)) {
        const data = fs.readFileSync(this.productsPath, "utf-8");
        return JSON.parse(data);
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error al cargar productos:", error.message);
      return [];
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.productsPath, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error("Error al guardar productos:", error.message);
    }
  }

  // Métodos para gestionar productos
  addProduct(product) {
    const existingProduct = this.products.find((p) => p.code === product.code);

    if (existingProduct) {
      throw new Error("Ya existe un producto con el mismo código.");
    }

    const newProduct = {
      id: this.generateProductID(), // Utiliza la función para generar el ID
      ...product,
    };

    this.products.push(newProduct);
    this.saveProducts();

    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      console.error("Producto no encontrado.");
    }
    return product;
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

// Ejemplo de uso
const productManager = new ProductManager("data/products.json");

try {
  const product1 = {
    title: "Producto 1",
    description: "Descripción del Producto 1",
    price: 19.99,
    thumbnail: "path/to/image1.jpg",
    code: "P001",
    stock: 50,
  };

  const product2 = {
    title: "Producto 2",
    description: "Descripción del Producto 2",
    price: 29.99,
    thumbnail: "path/to/image2.jpg",
    code: "P002",
    stock: 30,
  };

  productManager.addProduct(product1);
  productManager.addProduct(product2);

  console.log("Lista de productos:", productManager.getProducts());

  const productIdToFind = 1;
  console.log("Producto por ID:", productManager.getProductById(productIdToFind));
} catch (error) {
  console.error("Error al agregar producto:", error.message);
}

module.exports = ProductManager;
