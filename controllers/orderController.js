const orderService = require("../services/orderService.js");

const ITEM_PER_PAGE = 15;

function renderView(res, paginate, custom) {
    const pageControlObj = {
        orders: paginate.docs,
        lastPage: paginate.totalPages,
        totalOrders: paginate.totalDocs,
        currentPage: paginate.page,
        hasPrevPage: paginate.hasPrevPage,
        hasNextPage: paginate.hasNextPage,
        ITEM_PER_PAGE: paginate.limit,
        prevPage: paginate.prevPage,
        nextPage: paginate.nextPage,

        categoryPath: custom.categoryPath,
        searchString: custom.search,
        pageType: custom.pageType || "Đơn hàng",
        queryString: custom.queryString ? "&" + custom.queryString : "",
    };
    res.status(200);
    res.render("./orders/orders", pageControlObj);
}

exports.getAllOrders = async (req, res) => {
    const { status } = req.query;

    const query = {};
    status ? query.status = status : null;

    const options = {
        page: req.query.page * 1 || 1,
        limit: req.query.limit * 1 || ITEM_PER_PAGE,
    };
    const paginate = await orderService.listOrder(query, options);
    renderView(res, paginate, options);
};
