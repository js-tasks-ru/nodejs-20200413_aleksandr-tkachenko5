const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const document = await Category.find({});

  ctx.body = {categories: document};
  return next();
};
