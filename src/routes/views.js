// routes/views.js

import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Ruta para mostrar todos los productos con paginación
router.get('/products', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    try {
        // Filtro para búsqueda por categoría o disponibilidad (si se pasa un query param)
        const filter = query ? { category: query } : {};

        // Opciones para paginación
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? { price: 1 } : { price: -1 },
        };

        // Consulta paginada con Mongoose
        const products = await Product.paginate(filter, options);

        // Crear un array con números de página para la paginación
        const paginationNumbers = Array.from({ length: products.totalPages }, (_, i) => ({
            page: i + 1,
            active: i + 1 === products.page,
        }));

        // Renderizar la vista de productos con la paginación
        res.render('products', {
            title: 'Todos los Productos',
            products, // Asegúrate de pasar el objeto `products` completo
            paginationNumbers,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

// Ruta para la página de inicio (también puedes agregar paginación si es necesario)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // Obtener productos de MongoDB sin paginación
        res.render('home', { title: 'Home Page', products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

// Ruta para productos en tiempo real con websockets (sin paginación)
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find(); // Obtener productos de MongoDB
        res.render('realTimeProducts', { title: 'Real-Time Products', products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

export default router;
