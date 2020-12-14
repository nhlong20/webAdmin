const User = require("../controllers/userController");
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

    const paginate = await userService.getAllUsers(query, options);
    renderView(res, paginate, options);
};