const Products = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  /**
   * Get the query string form the request
   * */
  const {query} = ctx.query;

  /**
   * Search by query string and sort
   * @Link https://code.tutsplus.com/tutorials/full-text-search-in-mongodb--cms-24835
   * */
  const data = await Products.find({
    $text: {$search: query}},
  {score: {$meta: 'textScore'}})
      .sort({score: {$meta: 'textScore'}});
  /**
   * Response with the sorted result
   * */
  ctx.body = {products: data};
};
