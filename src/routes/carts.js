//routes/carts.js

import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const cartManager = new CartManager();

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create cart' });
    }
});

// Ruta para obtener los productos de un carrito específico por ID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(parseInt(cid));
        res.json(cart.products);
    } catch (error) {
        res.status(404).json({ error: 'Cart not found' });
    }
});

// Ruta para agregar un producto a un carrito específico
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
