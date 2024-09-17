//managers/ProductManager.js

import Product from '../models/Product.js';

export default class ProductManager {
    constructor(io) {
        this.io = io; // Referencia al servidor socket.io
    }

    // Obtener todos los productos con un límite opcional
    async getProducts(limit = 6) {
        try {
            const products = await Product.find().limit(limit); // Mongoose find()
            return products;
        } catch (error) {
            console.error('Error fetching products from MongoDB:', error);
            return [];
        }
    }

    // Agregar un nuevo producto
    async addProduct(title, description, shortDescription, code, price, stock, category, thumbnails = [], demoUrl) {
        if (!title || !shortDescription || price === undefined || stock === undefined) {
            throw new Error('Faltan campos obligatorios');
        }

        const newProduct = new Product({
            title,
            description: description || null,
            shortDescription,
            code: code || null,
            price,
            status: true,
            stock,
            category: category || null,
            thumbnails,
            demoUrl: demoUrl || null
        });

        try {
            const savedProduct = await newProduct.save(); // Guarda en MongoDB
            return savedProduct;
        } catch (err) {
            console.error('Failed to save product to MongoDB:', err);
            throw new Error('Failed to save product');
        }
    }

    // Eliminar un producto por su ID
    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id); // Elimina en MongoDB
            if (!deletedProduct) {
                throw new Error('Product not found');
            }
        } catch (error) {
            console.error('Error deleting product in MongoDB:', error);
            throw error;
        }
    }
}

