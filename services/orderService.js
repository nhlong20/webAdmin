const Order = require("../models/orderModel");

module.exports.getAllOrders = async () => {
    return await Order.find({});
};

module.exports.getOrderById = async (id) => {
    return await Order.findById(id);
}

module.exports.listOrder = async (query, options) => {
    const paginate = await Order.paginate(query, options);
    return paginate;
};

module.exports.changeOrderStatusById = async (uid, status) => {
    return await Order.findByIdAndUpdate(
        { _id: uid },
        { status: status },
        (err) => {
            if (err) throw err;
            console.log("Update user locked status successfully");
        }
    );
};