const Product = require("../models/productModel");

module.exports.listProduct = async (query, options) => {
    const paginate = await Product.paginate(query, options);
    return paginate;
};

module.exports.getAllProducts = async () => {
    return await Product.find({});
};

module
