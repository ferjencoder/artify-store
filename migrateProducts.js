//migrateProducts.js

import fs from 'fs';
import mongoose from 'mongoose';
import Product from './src/models/Product.js';

// Conectar a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/artify-store', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    migrateProducts();  // Llamar a la función para migrar los productos
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

const PRODUCTS_FILE_PATH = './src/files/products.json';

async function migrateProducts() {
    try {
        const data = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf-8');
        const products = JSON.parse(data);

        // Migrar cada producto
        for (let productData of products) {
            const newProduct = new Product({
                title: productData.title,
                shortDescription: productData.shortDescription,
                description: productData.description,
                code: productData.code,
                price: productData.price,
                stock: productData.stock,
                category: productData.category,
                thumbnails: productData.thumbnails,
                demoUrl: productData.demoUrl,
                status: productData.status
            });
            
            await newProduct.save();  // Guardar el producto en MongoDB
            console.log(`Producto ${newProduct.title} migrado con éxito`);
        }

        console.log('Migración de productos completada');
        mongoose.connection.close();  // Cerrar la conexión después de la migración
    } catch (error) {
        console.error('Error al migrar productos:', error);
    }
}
