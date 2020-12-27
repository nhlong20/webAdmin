const userService = require("../services/userService.js");
const User = require("../models/userModel");

const path = require("path");
const formidable = require("formidable");
var cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ITEM_PER_PAGE = 15;

function renderView(res, paginate, custom) {
    const pageControlObj = {
        users: paginate.docs,
        lastPage: paginate.totalPages,
        totalUsers: paginate.totalDocs,
        currentPage: paginate.page,
        hasPrevPage: paginate.hasPrevPage,
        hasNextPage: paginate.hasNextPage,
        ITEM_PER_PAGE: paginate.limit,
        prevPage: paginate.prevPage,
        nextPage: paginate.nextPage,

        categoryPath: custom.categoryPath,
        searchString: custom.search,
        pageType: custom.pageType || "Người dùng",
        queryString: custom.queryString ? "&" + custom.queryString : "",
    };
    res.status(200);
    res.render("./users/users", pageControlObj);
}

exports.getAllUsers = async (req, res) => {
    const query = {};
    const options = {
        page: req.query.page * 1 || 1,
        limit: req.query.limit * 1 || ITEM_PER_PAGE,
        sort: req.query.sort || "all",
    };

    const paginate = await userService.getUsers(query, options);
    renderView(res, paginate, options);
};

exports.searchUser = async (req, res) => {
    const search = req.query.search;
    const options = {
        page: req.query.page * 1 || 1,
        limit: req.query.limit * 1 || ITEM_PER_PAGE,
        sort: req.query.sort || "all",
    };
    var searchKey = new RegExp(search, "i");
    let query = { email: searchKey };

    const paginate = await userService.getUsers(query, options);
    paginate.search = search;
    options.categoryPath = "/users/search";
    renderView(res, paginate, options);
};

exports.changeUserLockedStatus = async (req, res) => {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    userService.changeUserLockedStatusById(id, !user.locked);
    res.redirect("/users/details/" + id);
};

exports.showUserDetails = async (req, res) => {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    res.render("./users/user-details", { user });
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect("/");
};

exports.getProfile = async (req, res, next) => {
    let user = req.user;
    const pageType = req.originalUrl;
    res.render("profile", { user, pageType });
};

exports.changeInformation = async (req, res, next) => {
    try {
        // Get user from db
        const user = await userService.getUserById(req.user._id);
        // Update information
        user.name = req.body.name;
        user.phoneNumber = req.body.phoneNumber;
        user.gender = req.body.gender;

        await user.save({ validateBeforeSave: false });

        console.log("Information changed uccessfully");
        //Redirect user
        req.flash("success", "Thông tin của bạn đã được cập nhật thành công");
        res.redirect("/users/details/" + user._id);
    } catch (error) {
        const errorMsg = error.message.split(":").pop();
        console.log(errorMsg);
        req.flash("error", errorMsg);
        res.redirect("/users/details/" + req.user._id);
    }
};

exports.changeProfilePicture = async (req, res, next) => {
    const form = new formidable.IncomingForm();

    form.uploadDir = path.join(__dirname, "/../uploads");
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024; //10MB
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return;
        }
        const uploadedPath = files.images.path;
        const uploadedRes = await cloudinary.uploader.upload(uploadedPath);
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { avatar: uploadedRes.secure_url }
        );
        // fs.unlinkSync(uploadedPath);
        console.log("Upload profile picture successfully");
        res.redirect("/users/details/" + req.user._id);
    });
};
