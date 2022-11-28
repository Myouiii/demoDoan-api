const addressRoute = require('express').Router();
const addressController = require('../controllers/address.controller');

// api: lấy danh sách các tỉnh thành phố
addressRoute.post('/getaddress', addressController.getAddressApi);

// api: lấy danh sách các tỉnh thành phố
addressRoute.get('/province', addressController.getProvince);

// api: lấy danh sách huyện/quận theo id tỉnh
addressRoute.get('/district', addressController.getDistrict);

// api: lấy danh sách phường, đường theo id huyện
addressRoute.get('/street', addressController.getWardStreetList);

// api: Lấy danh sách địa chỉ nhận hàng
addressRoute.get('/delivery', addressController.getDeliveryAddressList);

// api: Thêm địa chỉ nhận hàng
addressRoute.post('/delivery', addressController.postAddDeliveryAddress);

// api: Xoá 1 địa chỉ nhận hàng
addressRoute.delete('/delivery', addressController.delAddDeliveryAddress);

// api: cài mặc định 1 địa chỉ nhận hàng
addressRoute.put('/delivery', addressController.putSetDefaultDeliveryAddress);

module.exports = addressRoute;
