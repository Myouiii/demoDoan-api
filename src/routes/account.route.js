const accountRoute = require('express').Router();
const accountController = require('../controllers/account.controller');



// Đăng ký tài khoản
accountRoute.post('/signup', accountController.postSignUp);

// Gửi mã xác nhận để lấy lại mật khẩu
accountRoute.post('/verify/forgot', accountController.postSendCodeForgotPW);

// reset password
accountRoute.post('/reset-pw', accountController.postResetPassword);


module.exports = accountRoute;
