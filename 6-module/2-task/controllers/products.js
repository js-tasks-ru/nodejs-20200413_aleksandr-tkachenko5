const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.request.query;
  if (subcategory) {
    const products = await Product.getProductsBySubcategory(subcategory);
    const formattedProducts = [];
    for (const product of products) {
      formattedProducts.push(product.idFormatter());
    }
    ctx.body = {products: formattedProducts};
    return;
  } else {
    const products = await Product.getAllProducts();
    const formattedProducts = [];
    for (const product of products) {
      formattedProducts.push(product.idFormatter());
    }
    ctx.body = {products: formattedProducts};
    return;
  }

  // if (!product.length) {
  //   ctx.body = {products: []};
  //   return;
  // } else {
  //   console.log('kroka');
  // }

  // const products = await Product.getAllProducts().populate()

  ctx.body = {products: formattedProducts};
};

module.exports.productList = async function productList(ctx, next) {
  // const products = await Product.getAllProducts();

  // const {subcategory} = ctx.request.query;
  // const product = await Product.getProductById(subcategory);
  // if (!product.length) {
  //   ctx.body = {products: []};
  //   return;
  // }

  // const formattedProducts = [];
  // for (const product of products) {
  //   formattedProducts.push(product.idFormatter());
  // }

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

