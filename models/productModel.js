const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "A product must have a name"],
        unique: true,
        trim: true,
        maxlength: [
            40,
            "A product name must have less than or equal to 40 characters",
        ],
        minlength: [
            1,
            "A product name must have more than or equal to 1 characters",
        ],
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    brand: String,
    slug: String,
    sku: String,
    department: String, //top level of category
    category: String, // category path
    price: {
        type: Number,
        required: [true, "A product must have price"],
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: Boolean,
    },
    coverImage: {
        type: String,
        required: [true, "A product must have cover image"],
    },
    color: {
        type: String,
    },
    images: [
        {
            type: String,
        },
    ],
    size: {
        type: String,
    },
    sold: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
});
productSchema.index({name: 'text', brand: 'text'});
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
