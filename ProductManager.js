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
      console.log("Ya existe un producto con el mismo código. No se agregará duplicado.");
      return existingProduct; // Devuelve el producto existente si ya existe
    }

    //No devuelve mas un mensaje Error.,
    const newProduct = {
      id: this.generateProductID(),
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

  //Nuevos metodos
  updateProduct(id, updatedProduct) {
    const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      throw new Error("Producto no encontrado.");
    }

    this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct };
    this.saveProducts();
    return this.products[productIndex];
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.productsPath, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error("Error al guardar productos:", error.message);
    }
  }

  deleteProduct(id) {
    const updatedProducts = this.products.filter((product) => product.id !== id);
  
    if (this.products.length === updatedProducts.length) {
      throw new Error("Producto no encontrado.");
    }
  
    this.saveProducts(updatedProducts);
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
/*
  const product3 = {
    title: "Producto 3",
    description: "Descripción del Producto 3",
    price: 31.99,
    thumbnail: "path/to/image3.jpg",
    code: "P003",
    stock: 20,
  };
*/
  // Agrega los productos iniciales
  productManager.addProduct(product1);
  productManager.addProduct(product2);
  //productManager.addProduct(product3);
/*
// Obtén el ID del primer producto agregado
const productIdToUpdate = 1;

// Actualiza el primer producto
const updatedProduct = {
  title: "Producto Actualizado",
  description: "Descripción Actualizada",
  price: 39.99,
  thumbnail: "path/to/updated-image.jpg",
  code: "P001",
  stock: 25,
};

try {
  const updatedProductResult = productManager.updateProduct(productIdToUpdate, updatedProduct);
  console.log("Producto actualizado:", updatedProductResult);
} catch (error) {
  console.error("Error al actualizar producto:", error.message);
}

// Obtén el ID del segundo producto agregado
//const productIdToDelete = 1;

// Elimina el segundo producto
try {
  productManager.deleteProduct(1);
  console.log("Producto eliminado con éxito");
} catch (error) {
  console.error("Error al eliminar producto:", error.message);
}
*/
  // Muestra la lista de productos antes de las operaciones
  console.log("Lista de productos:", productManager.getProducts());

  const productIdToFind = 1;
  console.log("Producto por ID:", productManager.getProductById(productIdToFind));
} catch (error) {
  console.error("Error al agregar producto:", error.message);
}

module.exports = ProductManager;
