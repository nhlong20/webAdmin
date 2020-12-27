var express = require("express");
var router = express.Router();
const productController = require('../controllers/productController');

/* GET home page. */
router.get("/", productController.getProducts);

router.get("/edit/:id", productController.editProduct)

router.get("/add", (req, res, next) => {
    res.render("./products/add-product");
});

router.post("/insert", productController.insertProduct);

router.put("/update", productController.updateProduct);

router.delete("/delete/:id", productController.deleteProduct);

router.get('/search', productController.searchProducts);

module.exports = router;
