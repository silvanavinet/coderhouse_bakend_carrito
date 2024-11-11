const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const handlebars = require("express-handlebars");

// Ruta JSON
const filePath = path.join("", './src/data/products.json');

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
// Obtener todos los productos
router.get('/', (req, res) => {
    const file = readFile();
    if (!file) return res.status(500).send("Error al cargar los productos.");

    res.render("home", { 
        title: "Lista de Productos",
        products: file
      });
});

router.get('/realtimeproducts', (req, res) => {
    const file = readFile();
    if (!file) return res.status(500).send("Error al cargar los productos.");

    res.render("realTimeProducts", { 
        title: "Lista de Productos con Websocket",
        products: file
      });
});

module.exports = router;
