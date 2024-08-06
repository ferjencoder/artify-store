import fs from 'fs';

const CARTS_FILE_PATH = './src/files/carts.json';

export default class CartManager {

    async getCarts() {
        if (fs.existsSync(CARTS_FILE_PATH)) {
            try {
                const data = await fs.promises.readFile(CARTS_FILE_PATH, 'utf-8');
                return JSON.parse(data);
            } catch (error) {
                console.error('Error reading the carts file:', error);
                return [];
            }
        } else {
            console.warn(`${CARTS_FILE_PATH} doesn't exist`);
            return [];
        }
    }

    async addCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1,
            products: []
        };

        carts.push(newCart);

        try {
            await fs.promises.writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, '\t'));
        } catch (err) {
            console.error('Failed to write to file:', err);
            throw new Error('Failed to save cart');
        }

        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        const searchedCart = carts.find(cart => cart.id === id);

        if (!searchedCart) {
            throw new Error('Cart not found');
        }

        return searchedCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);

        if (cartIndex === -1) {
            throw new Error(`Cart with id ${cartId} not found`);
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        carts[cartIndex] = cart;

        try {
            await fs.promises.writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, '\t'));
        } catch (err) {
            console.error('Failed to write to file:', err);
            throw new Error('Failed to update cart');
        }

        return cart;
    }
}
