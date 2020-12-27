var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");
const authController = require("./../controllers/authController");

router.get('/', userController.getAllUsers);
router.get('/search', userController.searchUser);
router.get('/change-locked/:id', userController.changeUserLockedStatus);
router.get('/details/:id', userController.showUserDetails);
router.get('/logout', userController.logout);
router.post('/changeInformation', userController.changeInformation);
router.post("/changePassword", authController.changePassword);
router.post("/changeProfilePicture", userController.changeProfilePicture);

module.exports = router;