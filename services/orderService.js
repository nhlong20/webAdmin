const Order = require("../models/orderModel");

module.exports.getAllOrders = async () => {
    return await Order.find({});
};

module.exports.listOrder = async (query, options) => {
    const paginate = await Order.paginate(query, options);
    return paginate;
};