const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  ctx.body = {};
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = {error: 'Invalid identifier'};
    return;
  }


  const product = await Product.getProductById(id);
  if (!product.length) {
    ctx.status = 404;
    ctx.body = {error: 'Not Found'};
    return;
  }
  const data = product[0].idFormatter();
  ctx.body = {product: data};
};

