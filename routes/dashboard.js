var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("./contents/product", { title: "AWS Dashboard"});
});

router.get('/add-item', function (req, res, next) {
    res.render("./contents/add-item", { title: "AWS Add product" });
});

module.exports = router;
