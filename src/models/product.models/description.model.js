const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connect = require('../../helpers/connection_mongodb');


const productDescSchema = new Schema({
  idProduct: { type: Schema.Types.ObjectId, ref: 'product', required: true },
  title: { type: String, required: true, trim: true },
  desc: {
    type: Array,
    content: { type: String, required: true, trim: true },
    photo: { type: String, required: true, trim: true },
  },
});

const ProductDescModel = connect.model(
  'productDesc',
  productDescSchema,
  'productDesc',
);

module.exports = ProductDescModel;
