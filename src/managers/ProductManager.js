//ProductManager.js

import fs from 'fs';

const PRODUCTS_FILE_PATH = './src/files/products.json';

export default class ProductManager {
    constructor(io) {
        this.io = io; // Guardamos la referencia al servidor socket.io
    }

    async getProducts(num) {
        if (fs.existsSync(PRODUCTS_FILE_PATH)) {
            try {
                const data = await fs.promises.readFile(PRODUCTS_FILE_PATH, 'utf-8');
                const products = JSON.parse(data);

                if (num !== undefined) {
                    return products.slice(0, num);
                }

                return products;

            } catch (error) {
                console.error('Error reading the products file:', error);
                return [];
            }
        } else {
            console.warn(`${PRODUCTS_FILE_PATH} doesn't exist`);
            return [];
        }
    }

    async addProduct(title, description, shortDescription, code, price, stock, category, thumbnails = [], demoUrl) {
        if (!title || !shortDescription || price === undefined || stock === undefined) {
            throw new Error('Faltan campos obligatorios');
        }

        const products = await this.getProducts();
        const newProduct = {
            id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
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
        };

        products.push(newProduct);

        try {
            await fs.promises.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, '\t'));
            
            // Emitir el evento de actualización de productos
            this.io.emit('updateProducts', products);

        } catch (err) {
            console.error('Failed to write to file:', err);
            throw new Error('Failed to save product');
        }
    }


    async updateProduct(id, productData) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            return null;
        }

        const updatedProduct = { ...products[productIndex], ...productData, id };

        products[productIndex] = updatedProduct;

        await fs.promises.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, '\t'));

        // Emitir evento para actualizar la lista de productos en tiempo real
        this.io.emit('updateProducts', products);

        return updatedProduct;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(product => product.id !== id);

        if (products.length === filteredProducts.length) {
            throw new Error(`Product with id ${id} not found`);
        }

        try {
            await fs.promises.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(filteredProducts, null, '\t'));

            // Emitir evento para actualizar la lista de productos en tiempo real
            this.io.emit('updateProducts', filteredProducts);

        } catch (error) {
            console.error('Error writing to file:', error);
            throw error;
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const searchedProduct = products.find(product => product.id === id);

        if (!searchedProduct) {
            throw new Error('Product not found');
        }

        return searchedProduct;
    }
}
