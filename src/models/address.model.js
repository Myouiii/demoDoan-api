const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connect = require('../helpers/connection_mongodb');
// Address Collection: Lưu thông tin các tỉnh thành... ở Việt Nam
const addressSchema = new Schema({
  

  // mã code
  code: { type: String, required: true, trim: true },

  // tên tỉnh, thành phố trực thuộc trung ương
  name: { type: String, required: true, trim: true, unique: true},

  // Mảng các huyện, thị xã, quận
  districts: [
    {
      code: { type: Number, required: true, unique: true },
      name: { type: String, required: true, trim: true },
      // Mảng các phường, thị trấn
      wards: [
        {
          code: { type: Number},
          // Tiền tố của nó. Ví dụ: Phường
          name: { type: String, required: true, trim: true },
        },
      ]
    },
  ],
});
const AddressModel = connect.model('address', addressSchema, 'addresses');


module.exports = AddressModel;
