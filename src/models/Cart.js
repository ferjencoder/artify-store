//models/Cart.js

import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true, default: 1 }
        }
    ],
    totalPrice: { type: Number, required: true, default: 0 },
    totalItems: { type: Number, required: true, default: 0 }
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
