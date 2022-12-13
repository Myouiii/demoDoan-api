
const dotenv = require('dotenv');
dotenv.config();

// ! import third-party
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const cors = require('cors');
const morgan = require('morgan');
var bodyParser = require('body-parser')
const constants = require('./src/constants');
const passport = require('passport');
const corsConfig = require('./src/configs/cors.config');

// ! import local file

const loginRoute = require('./src/routes/login.route');
const accountRoute = require('./src/routes/account.route');
const adminRoute = require('./src/routes/admin.route');
const addressRoute = require('./src/routes/address.route')
const userRoute = require('./src/routes/user.route');
const productRoute = require('./src/routes/product.route');
const orderRoute = require('./src/routes/order.route');
// ! ================== set port ================== //
const app = express();
const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 3001);

// ! ================== setup ================== //
// app.use(express.static(path.join(__dirname, '/src/build')));


const dev = app.get('env') !== 'production';

if (!dev) {
  app.disable('x-powered-by');
  app.use(morgan('common'));
 
} else {
  app.use(morgan('dev'));
}

// ! ================== config ==================//
// ! set environment variables

app.use(bodyParser.json({ limit: constants.MAX_SIZE_JSON_REQUEST }));
app.use(bodyParser.urlencoded({extended:true, limit: constants.MAX_SIZE_JSON_REQUEST }));
app.use(cookieParser());
app.use(cors(corsConfig));

// Passport middleware
require('./src/middlewares/passport.middleware')(passport);
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.KEY]
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ! ================== Routes - Api ================== //


// api liên quan đến account
app.use('/apis/accounts', accountRoute);

// api trang admin
app.use('/apis/admin', adminRoute);

// // api liên quan đến address
 app.use('/apis/address', addressRoute);

// api liên quan đến product
app.use('/apis/products', productRoute);

// api liên quan user
app.use('/apis/user', userRoute);

// api liên quan đến login
app.use('/apis/login', loginRoute);

// // api liên quan đơn hàng
app.use('/apis/orders', orderRoute);
app.get("/", (req, res) => {
  console.log("user: ", res.user);
  res.send("home");
})  

// ! ================== Listening ... ================== //
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} !!`);
});
