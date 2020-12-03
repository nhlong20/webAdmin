const Product = require('../models/productModel');

exports.getAllProducts = async (req,res)=>{
 const products = await Product.find({});
 res.render('./contents/product', {products});
}
exports.editProduct = async (req, res) => {
    var id = req.params.id;
    const product = await Product.findById(id);
    res.render('./contents/edit-item', { product });
}

exports.insertProduct = async (req, res) => {
    var product = req.body.product;
    await Product.create(product);
    res.redirect('/');
}

exports.updateProduct = async (req, res) => {
    var updated = req.body.product;
    await Product.findOneAndUpdate({ _id: req.params.id }, updated, (err, result) => {
        if (err) throw err;
        console.log("Updated product: " + req.params.id);
    });
    res.redirect('/');
}

exports.deleteProduct = async (req, res) => {
    await Product.findOneAndDelete({ _id: req.params.id });
    res.redirect('/');
}