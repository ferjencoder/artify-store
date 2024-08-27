//routes/views.js

import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

// Ruta para mostrar todos los productos
router.get('/products', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('products', { title: 'All Products', products });
});


router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { title: 'Home Page', products });
});

router.get('/home', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { title: 'Home Page', products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { title: 'Real-Time Products', products });
});

export default router;
