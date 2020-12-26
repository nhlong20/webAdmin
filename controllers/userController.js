const userService = require("../services/userService.js");

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
    res.render("users", pageControlObj);
}

exports.getAllUsers = async (req, res) => {
    const query = {};
    const options = {
        page: req.query.page * 1 || 1,
        limit: req.query.limit * 1 || ITEM_PER_PAGE,
        sort: req.query.sort || 'all'
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
    options.categoryPath = '/users/search';
    renderView(res, paginate, options);
};

exports.changeUserLockedStatus = async (req, res) => {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    userService.changeUserLockedStatusById(id, !user.locked);
    res.redirect('/users/details/' + id);
};

exports.showUserDetails = async (req, res) => {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    console.log(user);
    res.render('user-details', { user });
};