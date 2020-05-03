const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subcategories: [subCategorySchema],
});

categorySchema.statics.returnAll = function() {
  return this.find({});
};

categorySchema.methods.customTransform = function() {
  const obj = this.toObject();

  //  Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
};

// categorySchema.methods('transform', function() {
//   const obj = this.toObject();
//
//   //  Rename fields
//   obj.id = obj._id;
//   delete obj._id;
//
//   return obj;
// });

module.exports = connection.model('Category', categorySchema);
