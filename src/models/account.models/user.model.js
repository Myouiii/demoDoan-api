const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connect = require('../../helpers/connection_mongodb');

const userSchema = new Schema({
  // id liên kết với account của user này
  accountId: { type: Schema.Types.ObjectId, required: true, ref: 'account' },
  fullName: { type: String, trim: true, required: true },
  birthday: { type: String, default: '1970-01-01' },
  // true: male
  gender: { type: Boolean, required: true, default: true },
  address: { type: String, trim: true, default: null },

  order: [{
    type: Schema.Types.ObjectId,
    ref: "order"
  }]
});

const UserModel = connect.model('user', userSchema, 'users');

module.exports = UserModel;
