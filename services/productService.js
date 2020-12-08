const Product = require('../models/productModel');
const ITEM_PER_PAGE = 9;

module.exports.listProduct = async (filterObj, pageNumber, itemPerPage) => {

    const paginate = await Product.paginate(filterObj,{
     page: pageNumber,
     limit: itemPerPage
    })
    return paginate;
};
