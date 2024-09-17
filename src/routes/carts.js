//routes/carts.js

import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });  // Crea un nuevo carrito vacío
        await newCart.save();  // Guarda el carrito en MongoDB
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create cart' });
    }
});

// Ruta para obtener los productos de un carrito específico por ID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid).populate('products.product');  // "populate" trae la información completa del producto
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart.products);
    } catch (error) {
        res.status(404).json({ error: 'Cart not found' });
    }
});

// Ruta para agregar un producto a un carrito específico
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        const product = await Product.findById(pid);
        if (!cart || !product) return res.status(404).json({ error: 'Cart or product not found' });

        // Buscar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(p => p.product.equals(pid));
        if (existingProductIndex > -1) {
            // Si ya existe, incrementar la cantidad
            cart.products[existingProductIndex].quantity += 1;
        } else {
            // Si no existe, agregarlo con cantidad 1
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();  // Guardar el carrito actualizado en MongoDB
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para eliminar un producto de un carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        // Filtrar los productos para eliminar el seleccionado
        cart.products = cart.products.filter(p => !p.product.equals(pid));

        await cart.save();  // Guardar el carrito actualizado
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para actualizar la cantidad de un producto en un carrito
router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;  // Se espera la nueva cantidad en el body
    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const productIndex = cart.products.findIndex(p => p.product.equals(pid));
        if (productIndex === -1) return res.status(404).json({ error: 'Product not found in cart' });

        // Actualizar la cantidad del producto
        cart.products[productIndex].quantity = quantity;
        await cart.save();  // Guardar el carrito actualizado

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para eliminar todos los productos de un carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.products = [];  // Vaciar el carrito
        await cart.save();  // Guardar el carrito vacío

        res.status(204).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
