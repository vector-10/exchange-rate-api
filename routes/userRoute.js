const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getAllUsers, updateProfile, updatePassword, logoutUser, deleteUser,  } = require('../controllers/userController');


// all routes related to user operations
router.route('/auth/register').post(registerUser);
router.route('/auth/login').post(loginUser);
router.route('/user/get-users').get(getAllUsers);
router.route('/user/delete-user').delete(deleteUser);
router.route('/user/get-profile').get(getUserProfile);
router.route('/user/logout').get(logoutUser);
router.route('/user/update-profile').put(updateProfile);
router.route('/user/update-password').put(updatePassword);


module.exports = router