const AdminModel = require("../models/account.models/admin.model");
const UserModel = require("../models/account.models/user.model");
const AccountModel = require("../models/account.models/account.model");
const OrderModel = require('../models/order.model');
const { cloudinary } = require('../configs/cloudinary.config');
const ProductModel = require('../models/product.models/product.model');
const ProductDescModel = require('../models/product.models/description.model');
const MobileModel = require('../models/product.models/mobile.models/mobile.model');
const BackupChargerModel = require('../models/product.models/mobile.models/backupCharger.model');
const constants = require('../constants');
const helpers = require('../helpers');

// fn: upload product avatar to cloudinary
const uploadProductAvt = async (avtFile, productCode) => {
  try {
    const result = await cloudinary.uploader.upload(avtFile,
      {
        folder: `products/${productCode}`,
        public_id: `${Date.now()}`,

      }
    );
    const { secure_url } = result;
    return secure_url;
  } catch (error) {
    throw error;
  }
};

// fn: upload product catalogs to cloudinary
const uploadProductCatalogs = async (catalogs, productCode) => {
  try {
    const urlCatalogs = [];
    for (let item of catalogs) {
      const result = await cloudinary.uploader.upload(item, {
        folder: `products/${productCode}`,
      });
      urlCatalogs.push(result.secure_url);
    }
    return urlCatalogs;
  } catch (error) {
    throw error;
  }
};

// fn: upload product desc photo to cloudinary
const uploadDescProductPhoto = async (desc, productCode) => {
  try {
    let result = [];
    for (let item of desc) {
      const { content, photo } = item;
      const resUpload = await cloudinary.uploader.upload(photo, {
        folder: `products/${productCode}/desc`,
        public_id: `${Date.now()}`,
      });
      result.push({ content, photo: resUpload.secure_url });
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// fn: Tạo chi tiết cho một sản phẩm
const createProductDetail = async (type, product) => {
  try {
    switch (type) {

      case constants.PRODUCT_TYPES.MOBILE: {
        const { afterCamera, beforeCamera, ...rest } = product;
        const cameras = { before: beforeCamera, after: afterCamera };
        return await MobileModel.create({ cameras, ...rest });
      }
      case constants.PRODUCT_TYPES.BACKUP_CHARGER:
        return await BackupChargerModel.create({ ...product });
      case constants.PRODUCT_TYPES.HEADPHONE:
        return await HeadphoneModel.create({ ...product });

      default:
        throw new Error('Loại sản phẩm không hợp lệ');
    }
  } catch (error) {
    throw error;
  }
};

// api: Thêm sản phẩm
const addProduct = async (req, res, next) => {
  try {
    const { product, details, desc } = req.body;

    const { type, avatar, code, ...productRest } = product;
    const { warranty, catalogs, ...detailRest } = details;
    // kiểm tra sản phẩm đã tồn tại hay chưa
    const isExist = await ProductModel.exists({ code });
    if (isExist) {
      return res.status(400).json({ message: 'Mã sản phẩm đã tồn tại !' });
    }
    // upload product avatar to cloudinary
    const avtUrl = await uploadProductAvt(avatar, code);
    // upload ảnh khác của sản phẩm
    const urlCatalogs = await uploadProductCatalogs(catalogs, code);

    // upload ảnh bài viết mô tả
    let productDesc = desc
      ? await uploadDescProductPhoto(desc.detailDesList, code)
      : null;

    //Tạo sản phẩm mới
    const newProduct = await ProductModel.create({
      type,
      code,
      avt: avtUrl,
      ...productRest,
    });

    // Tạo sp thành công thì tạo chi tiết sản phẩm theo từng loại
    if (newProduct) {
      const { _id } = newProduct;
      // Tạo bài viết mô tả
      const newDesc = productDesc
        ? await ProductDescModel.create({
          idProduct: _id,
          title: desc.title,
          desc: productDesc,
        })
        : null;

      // Tạo chi tiết sản phẩm
      const newProductDetail = await createProductDetail(type, {
        idProduct: _id,
        details: newDesc ? newDesc._id : null,
        warranty,
        catalogs: urlCatalogs,
        ...detailRest,
      });

      if (newProductDetail) {
        return res.status(200).json({ message: 'Thêm sản phẩm thành công' });
      }
    }
  } catch (error) {
    console.log("err: ", error);
    return res.status(409).json({ message: 'Lỗi đường truyền, thử lại' });
  }
};

// api: Lấy danh sách sản phẩm theo loại và trang
const getProductListByType = async (req, res, next) => {
  try {
    const { type, page, perPage } = req.query;
    const nSkip = (parseInt(page) - 1) * perPage;
    const numOfProduct = await ProductModel.countDocuments({ type });
    const result = await ProductModel.find({ type })
      .skip(nSkip)
      .limit(parseInt(perPage));
    return res.status(200).json({ count: numOfProduct, data: result });
  } catch (error) {
    throw error;
  }
};

// api: Xoá một sản phẩm
const removeProduct = async (req, res, next) => {
  try {
    const { id } = req.query;
    const response = await ProductModel.findById(id).select('type');
    if (response) {
      // xoá sản phẩm
      await ProductModel.deleteOne({ _id: id });
      // xoá bài mô tả sản phẩm
      await ProductDescModel.deleteOne({ idProduct: id });
      const { type } = response;
      // xoá chi tiết sản phẩm
      const Model = helpers.convertProductType(type);
      await Model.deleteOne({ idProduct: id });
    }
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    return res.status(409).json({ message: 'Xoá sản phẩm thất bại' });
  }
};

// api: Cập nhật sản phẩm
const updateProduct = async (req, res, next) => {
  try {
    const product = req.body;
    const { _id, ...rest } = product;
    const result = await ProductModel.updateOne(
      { _id: product._id },
      { ...rest },
    );
    if (result && result.ok === 1) {
      return res.status(200).json({ message: 'success' });
    }
  } catch (error) {
    console.error(error);
    return res.status(409).json({ message: 'failed' });
  }
};


const postSignUp = async (req, res, next) => {
  try {
    const {
      userName,
      password,
      fullName,
      email,
      type,
      age,
    } = req.body.account;

    console.log(req.body.account);
    //Kiểm tra tài khoản đã tồn tại hay chưa
    const account = await AdminModel.findOne({ email });
    //nếu tồn tại, thông báo lỗi, return
    if (account) {
      let suffixError =
        account.authType === 'local'
          ? ''
          : `bởi đăng nhập với ${account.authType}`;
      let error = `Email đã được sử dụng ${suffixError} !`;

      if (account) return res.status(400).json({ message: error });
    }


    // Tạo tạo tài khoản tương ứng
    const newAcc = await AdminModel.create({
      userName,
      password,
      fullName,
      email,
      type,
      age,

    });


    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Account Creation Failed.',
      error,
    });
  }
};
// api: đăng nhập với admin
const postLogin = async (req, res, next) => {
  try {
    console.log("req: ", req);
    const { userName, password } = req.body;

    const adminUser = await AdminModel.findOne({ userName, password });
    if (adminUser) {
      return res.status(200).json({ name: adminUser.fullName });
    } else {
      return res.status(400).json({ message: 'failed' });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'failed' });
  }
};

// api: lấy danh sách user admin
const getUserAdminList = async (req, res, next) => {
  try {
    const list = await AdminModel.find({}).select('-password');
    if (list) {
      return res.status(200).json({ list });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'failed' });
  }
};
// api: xoá 1 admin
const delAdmin = async (req, res, next) => {
  try {
    const { email } = req.body;
    const admin = await AdminModel.findOne({ email: email });
    console.log(admin);

    if (admin) {
      await AdminModel.deleteOne({ email: admin.email });
      return res.status(200).json({});
    }
  } catch (error) {
    console.log(error);
    return res.status(409).json({});
  }
};
// api: lấy danh sách người dùng
const getCustomerList = async (req, res, next) => {
  try {
    const list = await UserModel.find({}).populate({
      path: 'accountId',
      select: 'email authType -_id',
    });
    return res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ list: [] });
  }
};
// api: lấy 1 người dùng
const getCustomerById = async (req, res, next) => {
  try {
    const id = req.body;
    const list = await UserModel.find({ id });
    return res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ list: [] });
  }
};
// api: xoá 1 người dùng
const delCustomer = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const customer = await UserModel.findById(userId);

    if (customer) {
      await AccountModel.deleteOne({ _id: customer.accountId });
      await UserModel.deleteOne({ _id: userId });
      return res.status(200).json({});
    }
    else{
      return res.status(409).json({});
    }
  } catch (error) {
    console.log(error);
    return res.status(409).json({});
  }
};

// api: lấy danh sách đơn hàng
const getOrderList = async (req, res, next) => {
  try {
    
    const list = await OrderModel.find().populate('owner').select('-deliveryAdd -note');
    return res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    return res.status(401).json({});
  }
};

// api: cập nhật trạng thái đơn hàng
const postUpdateOrderStatus = async (req, res, next) => {
  try {
    const { id, orderStatus } = req.body;
    const response = await OrderModel.updateOne({ _id: id }, { orderStatus });
    if (response) return res.status(200).json({});
  } catch (error) {
    return res.status(401).json({});
  }
};

module.exports = {

  addProduct,
  getProductListByType,
  removeProduct,
  updateProduct,
  postSignUp,
  postLogin,
  getUserAdminList,
  delAdmin,
  getCustomerList,
  getCustomerById,
  delCustomer,
  getOrderList,
  postUpdateOrderStatus,
};
