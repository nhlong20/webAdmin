const User = require("../models/userModel");

/**
 * check Credentails to authenticate user. Return user if true
 * @param {*} email
 * @param {*} password
 */
module.exports.checkCredential = async (email, password) => {
    try {
        const user = await User.findOne({ email }).select("+password");
        console.log(user.admin);
        // 2. Check whether user exists && password is correct or not
        if (!user || !(await user.checkPassword(password, user.password)) || !user.admin) {
            return null;
        }
        user.password = undefined;
        return user;
    } catch (err) {
        console.log(err.message);
    }
};
