// routes/products.js

import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Ruta para listar todos los productos con una limitación opcional
router.get('/', async (req, res) => {
    const { limit, page = 1, sort, query } = req.query;
    
    try {
        const filter = query ? { $or: [{ category: query }, { status: query }] } : {};
        const options = {
            limit: limit ? parseInt(limit) : 10,
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };
        
        const products = await Product.paginate(filter, options); // Paginación de Mongoose

        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});

// Ruta para obtener un producto específico por ID
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    const { title, shortDescription, price, stock, category, thumbnails, demoUrl } = req.body;
    
    try {
        const newProduct = new Product({
            title,
            shortDescription,
            price,
            stock,
            category,
            thumbnails,
            demoUrl
        });
        
        await newProduct.save();
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
        const updatedProduct = await Product.findByIdAndUpdate(pid, productData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(pid);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
