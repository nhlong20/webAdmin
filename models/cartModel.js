const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [
        {
            quantity: {
                type: Number,
                default: 0
            },
            product: {
                type: product
            }
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Cart must belong to a User!']
    },
    subTotal: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

