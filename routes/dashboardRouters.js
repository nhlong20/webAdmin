var express = require("express");
var router = express.Router();
const productController = require('../controllers/productController');

/* GET home page. */
router.get("/", productController.getProducts);

router.get("/edit/:id", productController.editProduct)

router.get("/add", (req, res, next) => {
    res.render("add-product", { title: "AWS Add product" });
});

router.post("/add-to-db", productController.insertProduct);

router.put("/edited/:id", productController.updateProduct);

router.delete("/deleted/:id", productController.deleteProduct);

router.get('/search', productController.searchProducts);

router.get('/:brand', )

module.exports = router;
