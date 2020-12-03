const Product = require('../models/productModel');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
exports.getAllProducts = async (req, res) => {
    const products = await Product.find({});
    res.render('./contents/product', { products });
};
exports.editProduct = async (req, res) => {
    var id = req.params.id;
    const product = await Product.findById(id);
    res.render('./contents/edit-item', { product });
};

exports.insertProduct = async (req, res) => {
    //var product = req.body.product;
    //console.log(product);

    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '/../uploads');
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024; //10MB
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return;
        }
        const uploadedPath = files.images.path;
        const uploadedRes = await cloudinary.uploader.upload(uploadedPath);
        const product = fields;
        product.coverImage = uploadedRes.secure_url;
        const uploadProduct = await Product.create(product);
        // console.log(uploadProduct);
        console.log('Uploaded product successfully');
        res.redirect('/');
    });
};

exports.updateProduct = async (req, res) => {
    var updated = req.body.product;
    await Product.findOneAndUpdate(
        { _id: req.params.id },
        updated,
        (err, result) => {
            if (err) throw err;
            console.log('Updated product: ' + req.params.id);
        }
    );
    res.redirect('/');
};

exports.deleteProduct = async (req, res) => {
    await Product.findOneAndDelete({ _id: req.params.id });
    res.redirect('/');
};
