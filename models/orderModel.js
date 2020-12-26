const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const orderSchema = new mongoose.Schema(
    {
        order_id: {
            type: String,
            required: [true, "Order must have an id"],
        },
        products: {
            type: Object,
            required: [true, "Order must contain a Product!"],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Order must belong to a User!"],
        },
        totalPrice: {
            type: Number,
            require: [true, "Order must have a price."],
        },
        paymentType: {
            type: String,
            default: "COD",
        },
        paid: {
            type: Boolean,
            default: false,
        },
        status: {
            type: Number,
            default: 1,
            require: true,
        },
    },
    { timestamps: true }
);

// orderSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'products'
//     });
//     next();
// });
orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
