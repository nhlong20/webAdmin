const Product = require("../models/productModel");
const ITEM_PER_PAGE = 9;

module.exports.listProduct = async (query, options) => {
    const paginate = await Product.paginate(query, options);
    return paginate;
};
