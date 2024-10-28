const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Ruta JSON
const filePath = path.join("", './data/products.json');

// Función para leer el archivo
function readFile() {
    try {
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (err) {
        console.error("Error al leer el archivo:", err);
        return null;
    }
}

// Función para escribir en el archivo
function writeFile(data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error al escribir en el archivo:", err);
    }
}

// Obtener todos los productos
router.get('/', (req, res) => {
    const file = readFile();
    if (!file) return res.status(500).send("Error al cargar los productos.");

    res.send(file);
});

// Obtener un producto por ID
router.get('/:pid', (req, res) => {
    const file = readFile();
    if (!file) return res.status(500).send("Error al cargar los productos.");

    const product = file.find(p => p.id === req.params.pid);
    if (!product) return res.status(404).send("Producto no encontrado.");

    res.send(product);
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
    const newId = crypto.randomUUID();
    const data = req.body;
    data.id = newId;

    const file = readFile();
    if (!file) return res.status(500).send("Error al cargar los productos.");

    file.push(data);

    writeFile(file);
    res.send({ message: "Producto agregado", product: data });
});

// Actualizar un producto existente
router.put('/:pid', (req, res) => {
    const file = readFile();
    if (!file) return res.status(500).send("Error al cargar los productos.");

    const index = file.findIndex(p => p.id === req.params.pid);
    if (index === -1) return res.status(404).send("Producto no encontrado.");

    const updatedProduct = { ...file[index], ...req.body, id: req.params.pid };
    file[index] = updatedProduct;

    writeFile(file);
    res.send({ message: "Producto actualizado", product: updatedProduct });
});

// Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
    const file = readFile();
    if (!file) return res.status(500).send("Error al cargar los productos.");

    const index = file.findIndex(p => p.id === req.params.pid);
    if (index === -1) return res.status(404).send("Producto no encontrado.");

    // Eliminar el producto del array
    const deletedProduct = file.splice(index, 1)[0];

    writeFile(file);
    res.send({ message: "Producto eliminado", product: deletedProduct });
});

module.exports = router;
