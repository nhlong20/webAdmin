const Product = require("../models/productModel");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");

exports.getAllProducts = async (req, res) => {
    const products = await Product.find({});
    res.render("./contents/product", { products });
};
exports.editProduct = async (req, res) => {
    var id = req.params.id;
    const product = await Product.findById(id);
    res.render("./contents/edit-item", { product });
};

exports.insertProduct = async (req, res) => {
    //var product = req.body.product;
    //console.log(product);

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        var product = fields.product;
        console.log(product);
        var oldPath = files.images.path;
        var newPath =
            path.join(__dirname, "/public/uploads/images") +
            "/" +
            files.images.name;
        var rawData = fs.readFileSync(oldPath);
        await Product.create(product);
        fs.writeFile(newPath, rawData, (err) => {
            if (err) console.log(err);
            console.log("newpath: ", newPath);
            console.log("raw: ", rawData);
        });
    });

    res.redirect("/");
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
