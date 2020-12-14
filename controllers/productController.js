const Product = require("../models/productModel");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const productService = require("../services/productService.js");
const ITEM_PER_PAGE = 15;

var cloudinary = require("cloudinary").v2;
const { query } = require("express");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function renderView(res, paginate, custom) {
    const pageControlObj = {
        products: paginate.docs,
        lastPage: paginate.totalPages,
        totalProducts: paginate.totalDocs,
        currentPage: paginate.page,
        hasPrevPage: paginate.hasPrevPage,
        hasNextPage: paginate.hasNextPage,
        ITEM_PER_PAGE: paginate.limit,
        prevPage: paginate.prevPage,
        nextPage: paginate.nextPage,

        categoryPath: custom.categoryPath,
        searchString: custom.search,
        pageType: custom.pageType || "Sản phẩm",
        queryString: custom.queryString ? "&" + custom.queryString : "",
    };
    res.status(200);
    res.render("./contents/product", pageControlObj);
}

function toUpperOnlyFirstChar(word) {
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
}
function serializeQuery(query) {
    let str = [];
    for (let key in query)
        if (query.hasOwnProperty(key) && key != 'color' && key != "category" && key != "page") {
            str.push(
                encodeURIComponent(key) + "=" + encodeURIComponent(query[key])
            );
        }
    return str.join("&");
}

exports.getAllProducts = async (req, res) => {
    const { color, sort, brand } = req.query;

    const query = {};

    const options = {
        page: req.query.page * 1 || 1,
        limit: req.query.limit * 1 || ITEM_PER_PAGE,
        sort: sort || "all",
    };

    color ? (query.color = color) : null;
    brand ? (query.brand = toUpperOnlyFirstChar(brand)) : null;

    const custom = {};
    custom.queryString = serializeQuery(req.query);
    custom.categoryPath = "/";

    const paginate = await productService.listProduct(query, options);

    renderView(res, paginate, custom);
};
exports.editProduct = async (req, res) => {
    var id = req.params.id;
    const product = await Product.findById(id);
    res.render("./contents/edit-item", { product });
};

exports.insertProduct = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "/../uploads");
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

        fs.unlink(uploadedPath, function (err) {
            if (err) throw err;
            console.log("File deleted!");
        });
        console.log("Uploaded product successfully");
        res.redirect("/");
    });
};

exports.updateProduct = async (req, res) => {
    var updated = req.body.product;
    await Product.findOneAndUpdate(
        { _id: req.params.id },
        updated,
        (err, result) => {
            if (err) throw err;
            console.log("Updated product: " + req.params.id);
        }
    );
    res.redirect("/");
};

exports.deleteProduct = async (req, res) => {
    await Product.findOneAndDelete({ _id: req.params.id });
    res.redirect("/");
};

exports.searchProducts = async (req, res) => {
    const search = req.query.search;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || ITEM_PER_PAGE;
    var searchKey = new RegExp(search, "i");
    let query = { name: searchKey };

    const paginate = await productService.listProduct(query, page, limit);
    paginate.search = search;
    const categoryPath = "/search";
    renderView(res, paginate, categoryPath);
};