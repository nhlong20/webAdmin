const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        unique: true,
        trim: true,
        maxlength: [
            40,
            'A product name must have less than or equal to 40 characters'
        ],
        minlength: [
            1,
            'A product name must have more than or equal to 1 characters'
        ]
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    brand: String,
    slug: String,
    sku: String,
    department: String, //top level of category
    category: String, // category path
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean
    },
    coverImage: {
        type: String,
        required: [true, 'A product must have a cover image']
    },
    color: {
        type: String,
        required: [true, 'A product must have color']
    },
    images: [
        {
            type: String
        }
    ],
    size: {
        type: String,
        required: [true, 'A product must have sizes']
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
