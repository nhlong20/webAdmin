const productService = require("../services/productService.js");
const orderService = require("../services/orderService.js");

function getRevenueStatisticsFromStartDate(timeUnit, allOrders) {
    const now = new Date();
    var startDate = new Date;
    switch (timeUnit) {
        case "week":
            startDate = new Date(
                now.setDate(now.getDate() - now.getDay() + 1)
            );
            break;
        case "month":
            startDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );
            break;
        case "quarter":
            startDate = new Date(
                now.getFullYear(),
                Math.floor((now.getMonth() - 1) / 3) * 3 + 1,
                1
            );
            break;
        case "year":
            startDate = new Date(now.getFullYear(), 1, 1);
            break;
        default:
            return 0;
    }

    const orders = allOrders.filter((order) => {
        const date = new Date(order.createdAt);
        return date >= startDate;
    });

    var productList = new Map();
    orders.forEach((element) => {
        console.log(element);
        for (var item in element.products) {
            let product = element.products[item];
            if (productList.has(product.item._id)) {
                let currentProduct = productList.get(product.item._id);
                currentProduct.qty += product.qty;
                productList.set(
                    product.item._id,
                    currentProduct
                );
            } else {
                productList.set(product.item._id, product);
            }
        };
    });
    const revenue = orders.reduce((total, current) => total + current.totalPrice, 0);
    return {timeUnit, revenue , productList };
};

exports.dashboard = async (req, res) => {
    const unit = req.query.unit || "week";

    const allProducts = await productService.getAllProducts();
    const allOrders = await orderService.getAllOrders();

    allProducts.sort((a, b) => parseInt(b.sold) - parseInt(a.sold));
    const topProducts = allProducts.slice(0, 5);
    const statistics = getRevenueStatisticsFromStartDate(unit, allOrders);
    res.render("index", { topProducts, statistics });
};