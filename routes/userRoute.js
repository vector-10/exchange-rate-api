const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, deleteUser } = require('../controllers/userController');

router.route('/auth/register').post(registerUser);
router.route('/auth/login').post(loginUser);
router.route('/auth/getusers').get(getAllUsers);
router.route('/auth/deleteuser').delete(deleteUser);



module.exports = router