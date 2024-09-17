// managers/CartManager.js

import Cart from '../models/Cart.js';
import mongoose from 'mongoose';

export default class CartManager {
    async getCarts() {
        try {
            return await Cart.find().populate('products.product'); // Obtener los carritos con los detalles de los productos
        } catch (error) {
            console.error('Error al obtener carritos:', error);
            return [];
        }
    }

    async addCart() {
        const newCart = new Cart({ products: [] }); // Crear un nuevo carrito vacío
        try {
            await newCart.save(); // Guardar el nuevo carrito en MongoDB
            return newCart;
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
            throw new Error('Error al guardar el carrito');
        }
    }

    // Validar que el cartId sea un ObjectId válido antes de buscar en MongoDB
    async getCartById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID del carrito no válido');
        }

        try {
            const cart = await Cart.findById(id).populate('products.product'); // Obtener un carrito por su ID y popular los productos
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw new Error('Carrito no encontrado');
        }
    }

    async addProductToCart(cartId, productId) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('ID del carrito no válido');
        }

        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex === -1) {
                cart.products.push({ product: productId, quantity: 1 });
            } else {
                cart.products[productIndex].quantity += 1;
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            throw new Error('Error al agregar el producto al carrito');
        }
    }

    async deleteProductFromCart(cartId, productId) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('ID del carrito no válido');
        }

        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }

            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            throw new Error('Error al eliminar el producto del carrito');
        }
    }

    async updateCart(cartId, products) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('ID del carrito no válido');
        }

        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }

            cart.products = products;
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw new Error('Error al actualizar el carrito');
        }
    }

    async deleteAllProductsFromCart(cartId) {
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error('ID del carrito no válido');
        }

        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw new Error('Error al vaciar el carrito');
        }
    }
}
