const productService = require("../services/productService.js");
const orderService = require("../services/orderService.js");

function getRevenueStatisticsFromStartDate(timeUnit, allOrders) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var startDate = new Date();
    switch (timeUnit) {
        case 'today':
            startDate = today;
            console.log("today" + startDate);
            break;
        case "week":
            startDate = new Date(
                today.setDate(today.getDate() - today.getDay() + 1)
            );
            console.log("week" + startDate);
            break;
        case "month":
            startDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );
            console.log("month" + startDate);
            break;
        case "quarter":
            startDate = new Date(
                today.getFullYear(),
                Math.floor(today.getMonth() / 3) * 3,
                1
            );
            console.log("quarter" + startDate);
            break;
        case "year":
            startDate = new Date(today.getFullYear(), 1, 1);
            console.log("year" + startDate);
            break;
        default:
            return 0;
    }

    const orders = allOrders.filter((order) => {
        const date = new Date(order.createdAt);
        return date >= startDate && order.status == 0;
    });

    var productList = new Map();
    orders.forEach((element) => {
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
    const unit = req.query.unit || "today";

    const allProducts = await productService.getAllProducts();
    const allOrders = await orderService.getAllOrders();

    allProducts.sort((a, b) => parseInt(b.sold) - parseInt(a.sold));
    const topProducts = allProducts.slice(0, 10);
    const statistics = getRevenueStatisticsFromStartDate(unit, allOrders);
    res.render("index", { topProducts, statistics });
};

