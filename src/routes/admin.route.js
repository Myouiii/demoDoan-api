const adminRoute = require('express').Router();
const adminController = require('../controllers/admin.controller');

// api: Lấy danh sách sản phẩm theo trang và loại
adminRoute.get('/products', adminController.getProductListByType);

// api: Xoá 1 sản phẩm theo id
adminRoute.delete('/products/remove', adminController.removeProduct);

// api: thêm 1 sản phẩm
adminRoute.post('/products/add', adminController.addProduct);

// api: cập nhật 1 sản phẩm
adminRoute.put('/products/update', adminController.updateProduct);

adminRoute.post('/signup', adminController.postSignUp);

// api: đăng nhập với admin
adminRoute.post('/login', adminController.postLogin);

// api: lấy danh sách user admin
adminRoute.get('/users', adminController.getUserAdminList);

// api: lấy danh sách user admin
adminRoute.delete('/users/del', adminController.delAdmin);

// api: lấy danh sách người dùng
adminRoute.get('/customer', adminController.getCustomerList);


// api: xoá 1 người dùng
adminRoute.delete('/customer/del', adminController.delCustomer);

// api: lấy danh sách đơn hàng
adminRoute.get('/order', adminController.getOrderList);

// api: cập nhật trạng thái đơn hàng
adminRoute.post('/order', adminController.postUpdateOrderStatus);

module.exports = adminRoute;
