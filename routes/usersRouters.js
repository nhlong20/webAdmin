var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");

router.get('/', userController.getAllUsers);
router.get('/search', userController.searchUser);
router.get('/modify/:id', userController.changeUserStatus);
router.get('/details/:id', userController.showUserDetails)

module.exports = router;