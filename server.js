//server.js

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import productRoutes from './src/routes/products.js';
import cartRoutes from './src/routes/carts.js';
import viewsRoutes from './src/routes/views.js';
import ProductManager from './src/managers/ProductManager.js';

const app = express();
const PORT = 8080;

// Conectar a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/artify-store')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Configurar Handlebars con opciones para permitir acceso a propiedades de prototipo
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middleware para parsear JSON
app.use(express.json());

// Configuración del servidor HTTP y WebSocket
const server = createServer(app);
const io = new Server(server);

// Crear instancia de ProductManager con soporte para WebSocket
const productManager = new ProductManager(io);

// Configuración de WebSocket
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    // Escuchar el evento 'newProduct' desde el cliente
    socket.on('newProduct', async (productData) => {
        try {
            const { title, shortDescription, price, stock } = productData;

            // Validar campos requeridos
            if (!title || !shortDescription || price === undefined || stock === undefined) {
                throw new Error('Faltan campos obligatorios');
            }

            await productManager.addProduct(
                title,
                productData.description || null,
                shortDescription,
                productData.code || null,
                price,
                stock,
                productData.category || null,
                productData.thumbnails || [],
                productData.demoUrl || null
            );
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    // Escuchar el evento 'deleteProduct' desde el cliente
    socket.on('deleteProduct', async (productId) => {
        try {
            // Eliminar producto por su ObjectId
            await productManager.deleteProduct(productId);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });
});

// Rutas
app.use('/', viewsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Levantar el servidor
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
