const orderRoute = require('express').Router();
const orderController = require('../controllers/order.controller');

// api: lấy danh sách đơn hàng
orderRoute.get('/list', orderController.getOrderList);

// api: lấy chi tiết 1 đơn hàng
orderRoute.get('/', orderController.getOrderDetails);

// api: tạo 1 đơn hàng (tách nhiều sản phẩm ra mỗi sp 1 đơn)
orderRoute.post('/', orderController.postCreateOrder);

module.exports = orderRoute;
