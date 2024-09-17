// managers/CartManager.js

import Cart from '../models/Cart.js';

export default class CartManager {
    async getCarts() {
        try {
            return await Cart.find().populate('products.product'); // Mongoose para obtener los carritos y hacemos populate para obtener los detalles de los productos
        } catch (error) {
            console.error('Error al obtener carritos:', error);
            return [];
        }
    }

    async addCart() {
        const newCart = new Cart({ products: [] }); // Creamos un nuevo carrito vacío

        try {
            await newCart.save(); // Guardamos el nuevo carrito en MongoDB
            return newCart;
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
            throw new Error('Error al guardar el carrito');
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findById(id).populate('products.product'); // Obtenemos un carrito por su ID y populamos los productos
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
        try {
            const cart = await Cart.findById(cartId); // Buscamos el carrito por su ID
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId); // Buscamos si el producto ya está en el carrito

            if (productIndex === -1) {
                // Si no está, lo agregamos con cantidad 1
                cart.products.push({ product: productId, quantity: 1 });
            } else {
                // Si ya está, incrementamos la cantidad
                cart.products[productIndex].quantity += 1;
            }

            await cart.save(); // Guardamos los cambios en MongoDB
            return cart;
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            throw new Error('Error al agregar el producto al carrito');
        }
    }

    // Métodos adicionales para eliminar productos y vaciar carritos (según la consigna)

    async deleteProductFromCart(cartId, productId) {
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
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }

            cart.products = products; // Actualizamos con el nuevo arreglo de productos
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw new Error('Error al actualizar el carrito');
        }
    }

    async deleteAllProductsFromCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }

            cart.products = []; // Vaciar todos los productos del carrito
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw new Error('Error al vaciar el carrito');
        }
    }
}
