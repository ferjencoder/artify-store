//managers/ProductManager.js

import Product from '../models/Product.js';

export default class ProductManager {
    constructor(io) {
        this.io = io; // Referencia al servidor socket.io
    }

    // Obtener todos los productos con un límite opcional
    async getProducts(limit) {
        try {
            const products = await Product.find().limit(limit || 10); // Mongoose find()
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
            this.io.emit('updateProducts', await this.getProducts()); // Emite evento de actualización
            return savedProduct;
        } catch (err) {
            console.error('Failed to save product to MongoDB:', err);
            throw new Error('Failed to save product');
        }
    }

    // Actualizar un producto existente por su ID
    async updateProduct(id, productData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true }); // Actualiza en MongoDB
            if (!updatedProduct) {
                throw new Error('Product not found');
            }

            this.io.emit('updateProducts', await this.getProducts()); // Emite evento de actualización
            return updatedProduct;
        } catch (error) {
            console.error('Error updating product in MongoDB:', error);
            return null;
        }
    }

    // Eliminar un producto por su ID
    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id); // Elimina en MongoDB
            if (!deletedProduct) {
                throw new Error('Product not found');
            }

            this.io.emit('updateProducts', await this.getProducts()); // Emite evento de actualización
        } catch (error) {
            console.error('Error deleting product in MongoDB:', error);
            throw error;
        }
    }

    // Obtener un producto por su ID
    async getProductById(id) {
        try {
            const product = await Product.findById(id); // Busca en MongoDB
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            console.error('Error fetching product from MongoDB:', error);
            throw new Error('Product not found');
        }
    }
}
