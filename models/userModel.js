const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!"],
    },
    avatar: {
        type: String,
        default:
            "https://res.cloudinary.com/dh5xeom6f/image/upload/v1607703995/hsi57cqpkpxjzxoela74.jpg",
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: [true, "Email đã tổn tại, vui lòng kiểm tra lại"],
        lowercase: true,
        validate: [validator.isEmail, "Vui lòng cung cấp địa chỉ email hợp lệ"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Mật khẩu phải chứa ít nhất 6 ký tự"],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Vui lòng xác nhận mật khẩu của bạn"],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: "Mật khẩu xác nhận không trùng khớp",
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: false,
    },
    verifyToken: String,
});

userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified("password")) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});
userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified or this is new document
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000; // - 1s is approximately requested time

    next();
});
userSchema.methods.checkPassword = async function (
    inputPassword,
    userPassword
) {
    return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256", process.env.CRYPTO_SECRET_KEY)
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};
userSchema.methods.createVerifyToken = function () {
    const verifyToken = crypto.randomBytes(32).toString("hex");
    this.verifyToken = verifyToken;
    console.log(this.verifyToken);
    return verifyToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
