const jwt = require('jsonwebtoken');
const constants = require('../constants/index');
require('dotenv').config();
// tạo một jwt với account id
const encodedToken = async (
  secretKey,
  user,
  expire = constants.JWT_EXPIRES_TIME,
) => {
  return await jwt.sign(
    {
      iss: "myshop",
      sub: user,
    },
    secretKey,
    { expiresIn: expire },
  );
};

module.exports = {
  encodedToken,
};
