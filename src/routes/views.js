// routes/views.js

import express from 'express';
import Product from '../models/Product.js';
import CartManager from '../managers/CartManager.js';
import mongoose from 'mongoose';

const router = express.Router();
const cartManager = new CartManager();

// Ruta para mostrar todos los productos con paginación
router.get('/products', async (req, res) => {
    let { limit = 6, page = 1, sort = 'desc', query } = req.query;

    limit = isNaN(limit) ? 6 : parseInt(limit);
    page = isNaN(page) ? 1 : parseInt(page);
    sort = sort === 'asc' ? 1 : -1;

    try {
        const filter = query ? { category: query } : {};

        const options = {
            limit,
            page,
            sort: { price: sort }
        };

        const products = await Product.paginate(filter, options);

        if (page > products.totalPages && products.totalPages > 0) {
            return res.redirect(`/products?page=${products.totalPages}&limit=${limit}&sort=${sort}&query=${query}`);
        }

        const paginationNumbers = Array.from({ length: products.totalPages }, (_, i) => ({
            page: i + 1,
            active: i + 1 === products.page,
        }));

        res.render('products', {
            title: 'Todos los Productos',
            products,
            paginationNumbers,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos.');
    }
});

// Ruta para la página de inicio
router.get('/', async (req, res) => {
    const { limit = 6, page = 1, sort, query } = req.query;
    try {
        const filter = query ? { category: query } : {};

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? { price: 1 } : { price: -1 },
        };

        const products = await Product.paginate(filter, options);

        const paginationNumbers = Array.from({ length: products.totalPages }, (_, i) => ({
            page: i + 1,
            active: i + 1 === products.page,
        }));

        res.render('home', {
            title: 'Home Page',
            products: products.docs,
            paginationNumbers,
            currentPage: products.page,
            hasNextPage: products.hasNextPage,
            hasPrevPage: products.hasPrevPage,
            nextPage: products.nextPage,
            prevPage: products.prevPage,
            totalPages: products.totalPages
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

// Ruta para productos en tiempo real con websockets
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find(); // Obtener productos de MongoDB
        res.render('realTimeProducts', { title: 'Real-Time Products', products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos.');
    }
});

// Ruta para mostrar el carrito
router.get('/cart', async (req, res) => {
    let { cartId } = req.cookies; // Obtenemos el cartId de la cookie

    try {
        // Si no hay un cartId o no es válido, creamos un nuevo carrito
        if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
            const newCart = await cartManager.addCart();
            cartId = newCart._id.toString(); // Convertimos el ObjectId a string
            res.cookie('cartId', cartId); // Guardamos el nuevo cartId en las cookies
        }

        const cart = await cartManager.getCartById(cartId);
        res.render('cart', { title: 'Carrito', cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito.');
    }
});

export default router;
