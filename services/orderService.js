const Order = require("../models/orderModel");

module.exports.getAllOrders = async () => {
    return await Order.find({});
};
