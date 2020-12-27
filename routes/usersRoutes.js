var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");

router.get('/', userController.getAllUsers);
router.get('/search', userController.searchUser);
router.get('/change-locked/:id', userController.changeUserLockedStatus);
router.get('/details/:id', userController.showUserDetails);
router.get('/logout', userController.logout);

module.exports = router;