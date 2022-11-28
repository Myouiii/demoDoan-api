const productRoute = require('express').Router();
const productController = require('../controllers/product.controller');

// api: Lấy 1 sản phẩm theo id
productRoute.get('/', productController.getProduct);

// api: Lấy danh sách sản phẩm liên quan
productRoute.get('/list/related', productController.getProductList);

// api: lấy danh sách và phân trang
productRoute.get('/all', productController.getAllProducts);

// api: tìm kiếm sản phẩm
productRoute.get('/search', productController.getSearchProducts);

// api: lọc sản phẩm
productRoute.get('/filter', productController.getFilterProducts);

module.exports = productRoute;
