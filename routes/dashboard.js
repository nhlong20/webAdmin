var express = require("express");
var router = express.Router();
const productController = require('./../controllers/productController');

/* GET home page. */
router.get("/", productController.getAllProducts);

router.get("/edit/:id", productController.editProduct)

router.get("/add", (req, res, next) => {
    res.render("./contents/add-item", { title: "AWS Add product" });
});

router.post("/add-to-db", productController.insertProduct);

router.post("/edited/:id", productController.updateProduct);

module.exports = router;
