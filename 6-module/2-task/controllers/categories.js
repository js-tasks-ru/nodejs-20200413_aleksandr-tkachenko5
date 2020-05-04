const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const documents = await Category.find({});

  const tempArray = [];
  for (const doc of documents) {
    const temp = {
      id: doc.id,
      title: doc.title,
      subcategories: '',
    };

    const tempSubcategoriesArray = [];
    for (const category of doc.subcategories) {
      const temp = {
        id: category.id,
        title: category.title,
      };
      tempSubcategoriesArray.push(temp);
    }
    temp.subcategories = tempSubcategoriesArray;
    tempArray.push(temp);
  }
  ctx.body = {categories: tempArray};
  return next();
};
