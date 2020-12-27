var express = require("express");
var router = express.Router();
const passport = require("./../passport");
const authController = require("./../controllers/authController");

router.route("/login").post(
    passport.authenticate("local", {
        badRequestMessage: "Vui lòng nhập nhập email và mật khẩu để đăng nhập",
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })
);

router.route("/verify-email").get(authController.verifyEmail);

module.exports = router;
