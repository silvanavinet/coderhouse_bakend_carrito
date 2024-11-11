const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');


// Ruta JSON del carrito
const cartsFilePath = path.join("", './data/carts.json')

// Función para leer el archivo de carritos
function readCartsFile() {
    try {
        const fileData = fs.readFileSync(cartsFilePath, "utf8");
        return JSON.parse(fileData);
    } catch (err) {
        console.error("Error al leer el archivo de carritos:", err);
        return [];
    }
}

// Función para escribir en el archivo de carritos
function writeCartsFile(data) {
    try {
        fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error al escribir en el archivo de carritos:", err);
    }
}

// Ruta raíz POST / para crear un nuevo carrito
router.post('/', (req, res) => {
    const carts = readCartsFile();
    const newCart = {
        id: crypto.randomUUID(), // Genera un ID único para el carrito
        products: [] // Inicialmente vacío
    };

    carts.push(newCart);
    writeCartsFile(carts);

    res.send({ message: "Carrito creado", cart: newCart });
});

// Ruta GET /:cid para listar productos de un carrito
router.get('/:cid', (req, res) => {
    const carts = readCartsFile();
    const cart = carts.find(c => c.id === req.params.cid);

    if (!cart) return res.status(404).send("Carrito no encontrado.");
    res.send(cart.products);
});
// Ruta POST /:cid/product/:pid para agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCartsFile();
    const cart = carts.find(c => c.id === req.params.cid);

    if (!cart) return res.status(404).send("Carrito no encontrado.");

    // Buscar el producto en el carrito
    const productInCart = cart.products.find(p => p.product === req.params.pid);

    if (productInCart) {
        // Si el producto ya existe, incrementar la cantidad
        productInCart.quantity += 1;
    } else {
        // Si el producto no existe, agregarlo al carrito con cantidad 1
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    writeCartsFile(carts);
    res.send({ message: "Producto agregado al carrito", cart });
});


module.exports = router