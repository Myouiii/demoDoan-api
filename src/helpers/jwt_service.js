 const JWT = require('jsonwebtoken');
 const express = require('express');
const AccountModel = require('../models/account.models/account.model');
// const createError = require('http-errors')
// const client = require("../helpers/connection_redis");

// const signAccessToken = async (userId) => {
//     return new Promise((resolve, reject) => {
//         const payload = {
//             userId
//         }
//         const secret = process.env.ACCESS_TOKEN_SECRET;
//         const options = {
//             expiresIn: '30s' // 10m 10s
//         }
//         JWT.sign(payload, secret, options, (err, token) => {
//             if (err) reject(err);
//             resolve(token);
//         });
//     })
// }
// const verifyAccessToken = (req, res, next) => {
//     if (!req.headers['authorization']) {
//         return next(createError.Unauthorized());
//     }
//     const authHeader = req.headers['authorization'];
//     const bearerToken = authHeader.split(' ');
//     const token = bearerToken[1];
//     JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
//         if (err) {
//             if (err.name === 'JsonWebTokenError') {
//                 return next(createError.Unauthorized());
//             }
//             return next(createError.Unauthorized(err.message));

//         }
//         req.payload = payload
//         next();
//     });
// }
// const signRefreshToken = async (userId, keepLogin) => {
//     return new Promise((resolve, reject) => {
//         const payload = {
//             userId,
//             keepLogin
//         }
//         const secret = process.env.REFRESH_TOKEN_SECRET;
//         const options = {
//             expiresIn: '1y' // 10m 10s
//         }
//         JWT.sign(payload, secret, options, (err, token) => {
//             if (err) reject(err);
//             client.set(userId.toString(), token, 'EX', 360 * 24 * 60 * 60, (err, reply) => {
//                 if (err) {

//                     return reject(createError.InternalServerError());
//                 }
//                 resolve(token);
//             });
//         });
//     })
// }
// const verifyRefreshToken = async (refreshToken) => {

//     return new Promise((resolve, reject) => {
//         JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
//             if (err) {
//                 return reject(err);
//             }
//             client.get(payload.userId, (err, reply) => {
//                 if (err) {
//                     return reject(createError.InternalServerError());
//                 }
//                 if (refreshToken === reply) {

//                     return resolve(payload);
//                 }
//                 return reject(createError.Unauthorized());
//             })
//         })
//     })
// }
//authentication with JWT
const jwtAuthentication = async (req, res, next) => {
    try {
      res.locals.isAuth = false;
      let token = null;
      if (express().get('env') === 'production') token = req.query.token;
      else token = req.cookies.access_token;
  
      //if not exist cookie[access_token] -> isAuth = false -> next
      if (!token) {
        next();
        return;
      }
      //verify jwt
      const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        const { accountId } = decoded.sub;
        const user = await AccountModel.findById(accountId);
        if (user) {
          res.locals.isAuth = true;
          req.user = user;
        }
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: 'Unauthorized.',
        error,
      });
    }
  };
module.exports = {
    // signAccessToken,
    // verifyAccessToken,
    // signRefreshToken,
    // verifyRefreshToken
    jwtAuthentication
}