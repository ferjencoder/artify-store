//models/Product.js

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String },
    code: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String },
    thumbnails: [{ type: String }],
    demoUrl: { type: String },
    status: { type: Boolean, default: true }
});

// Aplicar el plugin de paginación
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;
