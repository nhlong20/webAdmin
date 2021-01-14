var express = require("express");
const { isLoggedIn } = require("../controllers/authController");
var router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", isLoggedIn, orderController.getAllOrders);
router.get("/details/:id", isLoggedIn, orderController.showOrderDetails);

module.exports = router;
