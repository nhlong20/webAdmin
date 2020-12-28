var express = require("express");
const { isLoggedIn } = require("../controllers/authController");
var router = express.Router();
const productController = require('../controllers/productController');

/* GET home page. */
router.get("/", isLoggedIn, productController.getProducts);

router.get("/edit/:id", isLoggedIn, productController.editProduct)

router.get("/add", isLoggedIn, (req, res, next) => {
    res.render("./products/add-product");
});

router.post("/insert", isLoggedIn, productController.insertProduct);

router.put("/update", isLoggedIn, productController.updateProduct);

router.delete("/delete/:id", isLoggedIn, productController.deleteProduct);

router.get('/search', isLoggedIn, productController.searchProducts);

module.exports = router;
