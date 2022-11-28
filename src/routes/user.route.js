const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/user.controller');
const passportAuth = require('../helpers/jwt_service');

// api: get  user
userRoute.get('/', passportAuth.jwtAuthentication, userController.getUser);

// api: update user
userRoute.put('/update', userController.putUpdateUser);

module.exports = userRoute;
