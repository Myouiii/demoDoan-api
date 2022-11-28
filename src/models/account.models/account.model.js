const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
require('dotenv').config();
const connect = require('../../helpers/connection_mongodb');

const accountSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    default: null,
  },
  googleId: {
    type: String,
    default: null,
  },
  authType: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  failedLoginTimes: {
    type: Number,
    default: 0,
  },
  refreshToken: {
    type: String,
    default: null,
  },
});

// hash password with bcrypt
// Note: callback should be a normal function -> use 'this'
accountSchema.pre('save', async function (next) {
  try {
    if (this.authType === 'local') {
      const saltRounds = await bcrypt.genSalt(10);
      //hashing password...
      const hashPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashPassword;
      next();
    }
    next();
  } catch (error) {
    next(error);
  }
});
// compare password with bcrypt
// Note: callback should be a normal function -> use 'this'
accountSchema.methods.isCheckPassword = async function (password){
  try {
      return await bcrypt.compare(password, this.password);
      
  } catch (error) {
  }
}
const AccountModel = connect.model('account', accountSchema, 'accounts');

module.exports = AccountModel;
