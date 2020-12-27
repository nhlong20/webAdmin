var express = require("express");
var router = express.Router();
const authController = require("./../controllers/authController");
const dasboardController = require("../controllers/dashboardController");

router.get("/login", authController.isGuest, (req, res, next) => {
    res.render("login", { layout: "login" });
});
router.get("/", authController.isLoggedIn, dasboardController.dashboard);

module.exports = router;
