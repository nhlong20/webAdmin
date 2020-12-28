var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");
const authController = require("./../controllers/authController");

router.get('/', authController.isLoggedIn, userController.getAllUsers);
router.get('/search', authController.isLoggedIn, userController.searchUser);
router.get('/change-locked/:id', authController.isLoggedIn, userController.changeUserLockedStatus);
router.get('/details/:id', authController.isLoggedIn, userController.showUserDetails);
router.get('/logout', authController.isLoggedIn, userController.logout);
router.post('/changeInformation', authController.isLoggedIn, userController.changeInformation);
router.post("/changePassword", authController.isLoggedIn, authController.changePassword);
router.post("/changeProfilePicture", authController.isLoggedIn, userController.changeProfilePicture);

module.exports = router;