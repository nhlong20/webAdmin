const User = require("../models/userModel");

/**
 * check Credentails to authenticate user. Return user if true
 * @param {*} email
 * @param {*} password
 */
module.exports.checkCredentials = async (email, password) => {
    try {
        const user = await User.findOne({ email }).select("+password");
        // 2. Check whether user exists && password is correct or not
        if (!user || !(await user.checkPassword(password, user.password))) {
            return null;
        }
        user.password = undefined;
        return user;
    } catch (err) {
        console.log(err.message);
    }
};
