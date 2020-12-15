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

module.exports.changeUserLockedStatusById = async (uid, status) => {
    return await User.findByIdAndUpdate({ _id: uid }, { locked: status }, err => {
        if (err) throw err;
        console.log("Update user locked status successfully");
    });
};

module.exports.getUsers = async (query, options) => {
    const paginate = await User.paginate(query, options);
    return paginate;
};