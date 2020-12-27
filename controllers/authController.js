"use strict";
const crypto = require("crypto");

const User = require("../models/userModel");
const userService = require("../services/userService");

exports.signup = async (req, res, next) => {
    try {
        const newUser = {
            name: req.body.fullname,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        };
        if (await userService.getUser({ email: newUser.email })) {
            throw new Error("Email đã được đăng ký");
        }
        const user = await userService.createUser(newUser);
        // Send email after sign up to confirm
        const verifyToken = user.createVerifyToken();
        await user.save({ validateBeforeSave: false }); // turn off all validator defined in userSchema

        const verifyURL = `${req.protocol}://${req.get(
            "host"
        )}/auth/verify-email?token=${verifyToken}`;
        try {
            await sendEmail({
                email: user.email,
                subject: `AWS-OS: Verify your email`,
                message: verifyURL,
            });
            req.flash(
                "success",
                "Email xác thực đã được gửi, vui lòng kiểm tra hộp thư của bạn."
            );
            res.redirect("/dang-nhap");
        } catch (error) {
            user.verifyToken = undefined;
            user.save();
            req.flash(
                "error",
                "Có lỗi trong quá trình gửi email, vui lòng thử lại"
            );
            res.redirect("/dang-nhap");
        }
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/dang-ky");
    }
};
exports.verifyEmail = async (req, res) => {
    try {
        // Find user with token
        const user = await userService.getUser({
            verifyToken: req.query.token,
        });
        if (!user) {
            throw new Error("Có gì đó không đúng, vui lòng kiểm tra lại.");
        }
        console.log(user);
        // activated user
        user.active = true;
        user.verifyToken = undefined;
        await user.save({ validateBeforeSave: false }); // turn off all validator defined in userSchema

        req.flash(
            "success",
            "Xác thực email thành công, đăng nhập để tiếp tục"
        );
        res.redirect("/dang-nhap");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/");
    }
};
exports.forgotPassword = async (req, res) => {
    //Get posted email
    const user = await userService.getUser({ email: req.body.email });
    if (!user) {
        req.flash("error", "Email chưa được đăng ký, vui lòng kiểm tra lại");
        return res.redirect("/quen-mat-khau");
    }
    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // turn off all validator defined in userSchema

    //Send Email to User
    const resetURL = `${req.protocol}://${req.get(
        "host"
    )}/reset-password?token=${resetToken}`;
    const message = `Click to set new password: ${resetURL}`;
    try {
        await sendEmail({
            email: user.email,
            subject: `Reset your AWS-OS password`,
            message,
        });
        req.flash(
            "success",
            "Email đã được gửi, vui lòng kiểm tra hộp thư để cập nhật thông tin."
        );
        res.redirect("/quen-mat-khau");
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false }); // turn off all validator defined in userSchema
        req.flash(
            "error",
            "Có lỗi trong quá trình gửi email, vui lòng thử lại"
        );
        res.redirect("/quen-mat-khau");
    }
};
exports.resetPassword = async (req, res) => {
    // Get user token
    const plainToken = req.query.token;
    console.log(plainToken);
    const hashToken = crypto
        .createHash("sha256")
        .update(plainToken)
        .digest("hex");
    // Check expire time of token, Compare token to token in db, set new password
    const user = await userService.getUser({
        passwordResetToken: hashToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        req.flash(
            "error",
            "Token không hợp lệ hoặc đã hết hạn, vui lòng kiểm tra lại"
        );
        return res.redirect("/dang-nhap");
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Redirect user to login page
    req.flash("success", "Cập nhật mật khẩu thành công, đăng nhập để tiếp tục");
    res.redirect("/dang-nhap");
};

exports.changePassword = async (req, res) => {
    try {
        // Get user from db
        const user = await User.findById(req.user._id).select("+password");
        console.log(user);
        // Check posted password and userpassword
        if (!(await user.checkPassword(req.body.oldPassword, user.password))) {
            let message = "Mật khẩu cũ không đúng, vui lòng kiểm tra lại"
            res.render('error', {message});
            throw new Error(message);
        }
        // Update password
        user.password = req.body.newPassword;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        console.log("Password updated successfully");
        //Redirect user
        req.flash("success", "Mật khẩu của bạn đã được cập nhật thành công");
        res.redirect("/users/details/" + user._id);
    } catch (error) {
        const errorMsg = error.message.split(":").pop();
        console.log(errorMsg);
        req.flash("error", errorMsg);
        res.redirect("/users/details/" + user._id);
    }
};

// Middleware
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Bạn cần đăng nhập trước để tiếp tục");
    res.redirect("/login");
};
exports.isGuest = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};
