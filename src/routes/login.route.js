const loginRoute = require('express').Router();
const loginController = require('../controllers/login.controller');

// ! passportAuth middleware để config passport
const passportAuth = require('../helpers/jwt_service')
const passport = require('passport');

// api: login with local
loginRoute.post('/', loginController.postLogin);

// api: login with gg
loginRoute.post(
  '/gg',
  passport.authenticate('google-token', { session: false }),
  loginController.postLoginWithGoogle,
);

// api: authenticated with jwt
loginRoute.get('/auth', passportAuth.jwtAuthentication, loginController.getAuth);

// api: refresh token
loginRoute.post('/refresh_token', loginController.postRefreshToken);

// api: logout
loginRoute.post('/logout', loginController.postLogout);

module.exports = loginRoute;
