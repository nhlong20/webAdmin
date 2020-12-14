const User = require("../models/userModel");

module.exports.createUser = async (newUser) => {
    return await User.create(newUser);
};
module.exports.getUser = async (options) => {
    return await User.findOne(options);
};
module.exports.getUserById = async (uid) => {
    return await User.findById(uid);
};
