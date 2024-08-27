//routes/products.js

import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

// Ruta para listar todos los productos con una limitación opcional
router.get('/', async (req, res) => {
    const { limit } = req.query;
    try {
        const products = await productManager.getProducts(limit ? parseInt(limit) : undefined);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});

// Ruta para obtener un producto específico por ID
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductById(parseInt(pid));
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails, demoUrl } = req.body;
    try {
        const newProduct = await productManager.addProduct(title, description, code, price, stock, category, thumbnails, demoUrl);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para actualizar un producto existente
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productData = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(parseInt(pid), productData);
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(parseInt(pid));
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
