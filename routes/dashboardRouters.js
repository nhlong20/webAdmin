var express = require("express");
var router = express.Router();
const dasboardController = require("../controllers/dashboardController");

router.get("/", dasboardController.dashboard);

module.exports = router;